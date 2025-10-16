import express from "express";
import cors from "cors";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(cors());

// Load curated dataset
const travelData = JSON.parse(fs.readFileSync("./data/travelData.json", "utf-8"));

// 🔄 Fetch Wikipedia sections
async function fetchWikiSections(name) {
  try {
    const sectionsRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
        name
      )}&prop=sections&format=json&origin=*`
    );
    const sectionsData = await sectionsRes.json();

    if (!sectionsData.parse) return null;

    const sectionIndices = [];
    const allowedSections = ["History", "Culture", "Tourism", "Attractions", "Landmarks", "Language"];

    for (const sec of sectionsData.parse.sections) {
      if (allowedSections.includes(sec.line)) {
        sectionIndices.push(parseInt(sec.index));
      }
    }

    let combinedText = "";
    for (const idx of sectionIndices) {
      const textRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
          name
        )}&prop=text&section=${idx}&format=json&origin=*`
      );
      const textData = await textRes.json();
      if (textData.parse?.text) {
        const html = textData.parse.text["*"];
        const plainText = html.replace(/<[^>]+>/g, "");
        combinedText += plainText + "\n\n";
      }
    }

    return combinedText || null;
  } catch (err) {
    console.error("Wikipedia fetch error:", err);
    return null;
  }
}

// 🔎 API endpoint
app.get("/api/info", async (req, res) => {
  const { city, country } = req.query;

  // Step 1: Check curated dataset
  if (city) {
    const curated = travelData.find((c) => c.city.toLowerCase() === city.toLowerCase());
    if (curated) {
      return res.json({
        type: "city",
        name: `${curated.city}, ${curated.country}`,
        info: `History: ${curated.history}\n\nCulture: ${curated.culture}\n\nLanguage: ${curated.language}\n\nAttractions: ${curated.attractions.join(", ")}`,
      });
    }
  }

  // Step 2: Wikipedia fallback (city first)
  if (city) {
    const wikiCity = await fetchWikiSections(city);
    if (wikiCity) {
      return res.json({
        type: "city",
        name: `${city}, ${country || ""}`,
        info: wikiCity,
      });
    }
  }

  // Step 3: Wikipedia fallback (country)
  if (country) {
    const wikiCountry = await fetchWikiSections(country);
    if (wikiCountry) {
      return res.json({
        type: "country",
        name: country,
        info: wikiCountry,
      });
    }
  }

  // Step 4: Nothing found
  return res.json({
    type: "none",
    name: city || country || "Unknown",
    info: "Sorry, no tourism/culture/history info found!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
