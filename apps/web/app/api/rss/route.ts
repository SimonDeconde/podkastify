// app/api/rss/route.ts

const generateXML = () => {
  // Example XML content without excessive newlines
  const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Your Podcast Title</title>
    <link>https://yourpodcast.com</link>
    <description>Your podcast description</description>
    <item>
      <title>Episode 1</title>
      <link>https://yourpodcast.com/episode1</link>
      <description>Description of episode 1</description>
    </item>
    <!-- Add more items as needed -->
  </channel>
</rss>`;
  return xmlContent;
};

export async function GET() {
  const xml = generateXML();
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
