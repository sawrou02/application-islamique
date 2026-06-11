"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmutableRequest = void 0;
exports.assertRuntimeFetchAPISupport = assertRuntimeFetchAPISupport;
const getHeadersConstructor = () => {
    if (typeof Headers !== 'undefined') {
        return Headers;
    }
    else {
        return (globalThis.Headers ??
            class _MockHeaders {
                constructor() {
                    throw new Error('Runtime built-in Headers API is not available.');
                }
            });
    }
};
class ImmutableHeaders extends getHeadersConstructor() {
    _throwImmutableError() {
        throw new Error('This operation is not allowed on immutable headers.');
    }
    set() {
        this._throwImmutableError();
    }
    append() {
        this._throwImmutableError();
    }
    delete() {
        this._throwImmutableError();
    }
}
class ImmutableRequest {
    constructor(request) {
        this._headers = new ImmutableHeaders(request.headers);
        this._request = request;
    }
    get cache() { return this._request.cache; }
    get credentials() { return this._request.credentials; }
    get destination() { return this._request.destination; }
    get integrity() { return this._request.integrity; }
    get keepalive() { return this._request.keepalive; }
    get method() { return this._request.method; }
    get mode() { return this._request.mode; }
    get redirect() { return this._request.redirect; }
    get referrer() { return this._request.referrer; }
    get referrerPolicy() { return this._request.referrerPolicy; }
    get signal() { return this._request.signal; }
    get url() { return this._request.url; }
    get bodyUsed() { return this._request.bodyUsed; }
    get duplex() { return this._request.duplex; }
    get headers() { return this._headers; }
    _throwImmutableBodyError() {
        throw new Error('This operation is not allowed on immutable requests.');
    }
    get body() { return null; }
    async arrayBuffer() { this._throwImmutableBodyError(); }
    async blob() { this._throwImmutableBodyError(); }
    async bytes() { this._throwImmutableBodyError(); }
    async formData() { this._throwImmutableBodyError(); }
    async json() { this._throwImmutableBodyError(); }
    async text() { this._throwImmutableBodyError(); }
    clone() { return this._request.clone(); }
}
exports.ImmutableRequest = ImmutableRequest;
function assertRuntimeFetchAPISupport({ Request, Response, Headers, process, } = globalThis) {
    if (typeof Request === 'undefined' ||
        typeof Response === 'undefined' ||
        typeof Headers === 'undefined') {
        if (typeof process !== 'undefined' && process.env && process.env.NODE_OPTIONS) {
            const nodeOptions = process.env.NODE_OPTIONS;
            if (nodeOptions.includes('--no-experimental-fetch')) {
                throw new Error('NODE_OPTIONS="--no-experimental-fetch" is not supported with Expo server. Node.js built-in Request/Response APIs are required to continue.');
            }
        }
        if (typeof process !== 'undefined' && process.version) {
            const version = process.version;
            const majorVersion = parseInt(version.replace(/v/g, '').split('.')[0], 10);
            if (majorVersion < 18) {
                throw new Error(`Node.js version ${majorVersion} is not supported. Upgrade to Node.js 20 or newer.`);
            }
        }
        throw new Error('Runtime built-in Request/Response/Headers APIs are not available. If running Node ensure that Node Fetch API, first available in Node.js 18, is enabled.');
    }
}
