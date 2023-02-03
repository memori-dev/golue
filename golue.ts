const ErrInvalidStatusCode = new Error("response has invalid status code")
const ErrUnexpectedStatusCode = new Error("response has unexpected status code")

const defaults = {
    validStatuses: [200],
    buildRequestInit: function() {
        return {}
    }
}

export enum method {
    GET = "GET",
    GET_BODY = "PATCH",
    POST = "POST",
    PATCH = "PATCH",
}

type endpoint = {
    path: string
    validStatuses?: number[]
    invalidStatuses: number[]
    buildRequestInit?: (...args: any) => RequestInit
}

type endpointFetch = (...args: any) => Promise<[Response?, Error?]>

export class Group {
    // The payload object must be exactly formatted
    static buildRequestInitJSON = function <T>(): (payload: T) => RequestInit {
        return function(payload: T): RequestInit {
            return {
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            }
        }
    }

    group

    // buildRequestInit takes in any passed in arguments and returns an object
    endpoint(method: method, {path, validStatuses = defaults.validStatuses, invalidStatuses, buildRequestInit = defaults.buildRequestInit}: endpoint): endpointFetch {
        const relPath = `/${this.group}/${path}`

        return async function (...args: any): Promise<[Response?, Error?]> {
            const fetchArgs = buildRequestInit(...args)
            fetchArgs.method = method

            try {
                let res = await fetch(relPath, fetchArgs)

                // Check if status is invalid
                if (invalidStatuses.includes(res.status)) {
                    return [res, ErrInvalidStatusCode]
                }
                // Check if status is valid
                else if (!validStatuses.includes(res.status)) {
                    return [res, ErrUnexpectedStatusCode]
                }

                return [res, void 0]
            } catch (e) {
                if (e instanceof Error) return [void 0, e]

                throw e
            }
        }
    }

    newGroup(group: string): Group {
        return new Group(this.group + "/" + group)
    }

    constructor(group: string) {
        this.group = group
    }
}
