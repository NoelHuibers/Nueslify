import { Segment, GPT, getMusicContent } from "~/utils/GPT/GPT";
import { createTransition, createNewsSummary } from "./GPT/OpenAIGPT";
// Wenn ich grade News bekomme, dann mach mal bitte neue TrackIDs
// Wenn ich gerdae Musik höre und nur noch ein Segment übrig dann geb mal bitte die neuen News

const mixer = async (currentSegment: Segment) => {
    if (currentSegment.segmentKind === 'news') {
        // return transition: string/mp3 + x musicids id[]
        const newsSegment: Segment = {
            segmentKind: 'news',
            content: {
                content: "Tolle Nachrichten aus aller Welt"
            }

        }

        const musicSegment: Segment = {
            segmentKind: 'music',
            content: [{
                title: "Test1",
                artistNames: ["Artist 1", "Collaboration 1"],
                id: 1
            },
            {
                title: "Test2",
                artistNames: ["Artist 2", "Collaboration 1"],
                id: 2
            }]
        }
        const musicIds = getMusicContent(musicSegment)?.map((track) => track.id);

        const transitionSegment = await createTransition(newsSegment, musicSegment)

        return [transitionSegment, musicIds]

    }
    else if (currentSegment.segmentKind === 'music') {
        // Get news from Db => Make to TTS => return transition: string/mp3 + news: mp3
        const news = "Langer newsstring, alle Infos die du jemals möchtest, wie cool ist das denn!"

        const newsSegment = await createNewsSummary(news);
        const transitionSegment = await createTransition(currentSegment, newsSegment)

        return [transitionSegment, newsSegment]

    }
    else {
        // Wir starten das erste mal
    }
}

export default mixer;


// Ich spiele gerade Musik, dann bedeutet das ich habe bereits die news+transition
// Der player wechselt auf News, dann bedeutet das mein currentsegment wird zu News und ich stell die neue anfrage