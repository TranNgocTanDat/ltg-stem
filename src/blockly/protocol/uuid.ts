export function createUUID() {
    return (
        "#" +
        Math.random()
            .toString(16)
            .substring(2, 9)
    );
}