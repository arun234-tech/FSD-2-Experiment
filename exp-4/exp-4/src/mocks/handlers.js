import {
    http,
    HttpResponse,
} from "msw";

export const handlers = [

    http.get(
        "/api/posts",
        () => {

            return HttpResponse.json([
                {
                    id: "mock-1",
                    title:
                        "Mock API Event",
                    platform:
                        "LinkedIn",
                    date:
                        "2026-09-01",
                    time:
                        "10:00",
                },
                {
                    id: "mock-2",
                    title:
                        "Testing with MSW",
                    platform:
                        "Twitter",
                    date:
                        "2026-09-02",
                    time:
                        "14:00",
                },
            ]);

        }
    ),

];