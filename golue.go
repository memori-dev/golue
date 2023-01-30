package api

import "net/http"

// TODO create a library for building request handlers based upon steps
//  each step has optional error w a corresponding set of status codes or some other method of tracking status codes
//  should be able to generate a javascript api file afterwards

const GetBody = http.MethodPatch
