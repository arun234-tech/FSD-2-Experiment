import {
    render,
    screen,
} from "@testing-library/react";

import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import CalendarEvent from "../components/CalendarEvent";

describe(
    "CalendarEvent",
    () => {

        test(
            "renders post information",
            () => {

                const post = {
                    id: "1",

                    title:
                        "Team Meeting",

                    platform:
                        "LinkedIn",

                    time:
                        "10:00",
                };

                render(
                    <CalendarEvent
                        post={
                            post
                        }
                        onClick={
                            vi.fn()
                        }
                    />
                );

                expect(
                    screen.getByText(
                        "Team Meeting"
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "LinkedIn"
                    )
                ).toBeInTheDocument();

                expect(
                    screen.getByText(
                        "10:00"
                    )
                ).toBeInTheDocument();
            }
        );

    }
);