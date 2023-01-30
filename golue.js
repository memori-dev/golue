const ErrInvalidStatusCode = new Error("response has invalid status code")
const ErrUnexpectedStatusCode = new Error("response has unexpected status code")

const validStatusesDefault = [200]
function buildFetchArgsDefault() {
    return {}
}

class Group {
    // The payload object must be exactly formatted
    // eg. {Key: "value", Key2: "value2"}
    // TODO take in validation
    static buildFetchArgsJSON = function(payloadObj) {
        return {
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(arguments[0]),
        }
    }

    group

    // buildFetchArgs takes in any passed in arguments and returns an object
    // TODO validation against arg[1]
    endpoint(method, {path, validStatuses = validStatusesDefault, invalidStatuses, buildFetchArgs = buildFetchArgsDefault}) {
        const relPath = `/${this.group}/${path}`

        return async function (...args) {
            const fetchArgs = buildFetchArgs(...args)
            fetchArgs.method = method

            let res = {}
            try {
                res = await fetch(relPath, fetchArgs)

                // Check if status is invalid
                if (invalidStatuses.includes(res.status)) {
                    res.err = ErrInvalidStatusCode
                }
                // Check if status is valid
                else if (!validStatuses.includes(res.status)) {
                    res.err = ErrUnexpectedStatusCode
                }
            } catch (e) {
                res.err = e
            }

            return res
        }
    }

    newGroup(group) {
        return new Group(this.group + "/" + group)
    }

    GET({path, validStatuses, invalidStatuses, buildFetchArgs}) {
        return this.endpoint("GET", arguments[0])
    }

    // Semantic fix to enable a body to be sent over a "GET" request
    // Do NOT use for endpoints using URL based caching
    GET_BODY({path, validStatuses, invalidStatuses, buildFetchArgs}) {
        return this.endpoint("PATCH", arguments[0])
    }

    PATCH({path, validStatuses, invalidStatuses, buildFetchArgs}) {
        return this.endpoint("PATCH", arguments[0])
    }

    POST({path, validStatuses, invalidStatuses, buildFetchArgs}) {
        return this.endpoint("POST", arguments[0])
    }

    constructor(group) {
        // TODO string validation
        this.group = group
    }
}

module.exports = {
    Group,
}
