import axios from 'axios'

export default class apiReq {
    /**
     * Stores an instance of `AbortController` to aid with cancelling requests
     */
    static abortController

    /**
     * Core method that carries out API requests using Axios library
     * @param {*} request 
     * @returns 
     */
    static async manageRequest(request) {
        let { method, data, headers } = request;
        const url = request.url.indexOf('http') >= 0 ? request.url : "http://localhost:8080" + request.url

        this.abortController = new AbortController();

        if(headers === undefined) headers = { "Content-Type": "application/json" }; // Authorization: "Basic " + btoa("admin:password"),
        let auth = localStorage.getItem("jwt");
        console.log({auth});
        if(request.url !== '/authenticate' && auth !== undefined && auth !== null) {
            auth = JSON.parse(auth);
            // console.log({auth});
            headers.Authorization = 'Bearer ' + auth.token;
        }
        console.log({headers});

        return (await axios({ method, url, headers, data, signal: this.abortController.signal, mode: 'cors' })).data;
    }

    /**
     * Performs adhoc API requests
     * @param {*} method 
     * @param {*} url 
     * @param {*} data 
     * @returns 
     */
    static async apiRequest(method, url, data) {
        return await this.manageRequest({ method, url, data });
    }

    /**
     * Performs standard GET API requests
     * @param {*} url 
     * @param {*} data 
     * @returns 
     */
    static async get(url, data = {}) {
        return await this.manageRequest({ method: 'GET', url, data });
    }

    /**
     * Performs standard POST API requests
     * @param {*} url 
     * @param {*} data 
     * @returns 
     */
    static async post(url, data = {}) {
        return await this.manageRequest({ method: 'POST', url, data });
    }

    /**
     * Performs standard DELETE API requests
     * @param {*} url 
     * @param {*} data 
     * @returns 
     */
     static async delete(url, data = {}) {
        return await this.manageRequest({ method: 'DELETE', url, data });
    }

    /**
     * Performs standard upload file API requests
     * @param {*} url 
     * @param {*} data 
     * @returns 
     */
     static async uploadFile(url, data = {}) {
        return await this.manageRequest({ method: 'POST', url, data, headers: {"Content-Type": "multipart/form-data"} });
    }

    /**
     * Aborts running requests
     */
    static async stop() {
        this.abortController.abort()
    }
}