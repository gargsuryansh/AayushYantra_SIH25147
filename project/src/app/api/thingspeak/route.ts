import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const channelId = process.env.THINGSPEAK_CHANNEL_ID;
    const apiKey = process.env.THINGSPEAK_READ_API_KEY;

    if (!channelId || !apiKey) {
        return NextResponse.json({ error: 'Missing configuration' }, { status: 500 });
    }

    try {
        let url = `https://api.thingspeak.com/channels/${channelId}/feeds/last.json?api_key=${apiKey}`;

        if (limit) {
            url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${limit}`;
        }

        const response = await fetch(url, { headers: { 'Cache-Control': 'no-store' } });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ThingSpeak API Error: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Failed to fetch from ThingSpeak: ${response.status}`);
        }

        const data = await response.json();

        if (limit) {
            // Return array of history data
            const history = data.feeds.map((feed: any) => ({
                timestamp: feed.created_at,
                temperature: parseFloat(feed.field1) || 0
            }));
            return NextResponse.json({ history });
        } else {
            // Return single last value
            return NextResponse.json({
                temperature: parseFloat(data.field1) || 0,
                lastUpdate: data.created_at
            });
        }

    } catch (error) {
        console.error('ThingSpeak Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
