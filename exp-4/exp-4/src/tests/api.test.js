import {
    describe,
    expect,
    test,
} from "vitest";

describe(
    "Mock API",
    () => {

        test(
            "returns mocked posts",
            async () => {

                const response =
                    await fetch(
                        "/api/posts"
                    );

                const posts =
                    await response.json();

                expect(
                    response.ok
                ).toBe(true);

                expect(
                    posts
                ).toHaveLength(2);

                expect(
                    posts[0].title
                ).toBe(
                    "Mock API Event"
                );

            }
        );

    }
);