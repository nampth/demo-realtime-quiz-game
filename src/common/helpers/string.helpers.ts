export function getEmailDomain(email) {
    // Regular expression to match the domain part of an email address
    const domainRegex = /@([^.@]+)\.[^.@]+$/;

    // Match the domain part using the regular expression
    const match = email.match(domainRegex);

    // If a match is found, return the domain part
    if (match) {
        return match[1];
    } else {
        // Handle invalid email format
        return null;
    }
}

export function isValidPath(path) {
    // Define a regular expression pattern for the path format
    const pathPattern = /^[a-zA-Z0-9\/\-\_]+\.json$/;

    // Test if the path matches the pattern
    return pathPattern.test(path);
}

export function stripTags(input) {
    return input.replace(/(<([^>]+)>)/gi, "");
}
