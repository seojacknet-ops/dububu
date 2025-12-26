export const GIFS = {
    love: [
        "https://media.tenor.com/y_v4FLiKK3cAAAAM/kiss-me-through-the-phone-miss-you.gif",
        "https://media.tenor.com/JcPATwwdUOQAAAAm/bubu-dudu-sseeyall.webp",
    ],
    hug: [
        "https://media.tenor.com/pN7xf12qQcwAAAAM/cuddle-cute.gif",
        "https://media.tenor.com/vzkveVGDzmAAAAAm/dudu-hug-bubu-dudu-kiss.webp",
    ],
    sleep: [
        "https://media.tenor.com/cI9KcgiXQUkAAAAm/sseeyall-bubu-dudu.webp",
        "https://media.tenor.com/oPHqTKxUDo4AAAAm/bubu-dudu-sleep-funny-bubu-dudu-love.webp",
    ],
    cute: [
        "https://media.tenor.com/BvlQdl0TAeIAAAAm/cute.webp",
        "https://media.tenor.com/eEf0j_M3z9wAAAAm/bubu-dudu-sseeyall.webp",
    ],
    celebration: [
        "https://media.tenor.com/HOLG_hTN8WsAAAAm/bubu-jumping-on-dudu-happy.webp",
    ],
} as const;

export function getRandomGif(category: keyof typeof GIFS): string {
    const gifs = GIFS[category];
    return gifs[Math.floor(Math.random() * gifs.length)];
}
