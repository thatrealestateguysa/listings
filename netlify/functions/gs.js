// netlify/functions/gs.js
const GS_URL = "https://script.google.com/macros/s/AKfycbw80HgzBHg6mzPxJCuOfC45Ot1Z6Edu9rp5qLnYmgZh_oc69XmzHhvM9zItzU2UESY/exec";

exports.handler = async function(event) {
  const params = new URLSearchParams(event.rawQuery || "");
  const action = params.get("action");
  if (action === "ping" || !action) {
    return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok:true, pong:"functions-alive" }) };
  }
  const url = GS_URL + "?" + params.toString();
  const method = event.httpMethod || "GET";
  try {
    const resp = await fetch(url, {
      method,
      headers: method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" } : undefined,
      body: method === "POST" ? event.body : undefined,
      redirect: "follow"
    });
    const text = await resp.text();
    return { statusCode: resp.status, headers: { "content-type": resp.headers.get("content-type") || "application/json", "cache-control": "no-store" }, body: text };
  } catch (err) {
    return { statusCode: 502, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok:false, error: "Proxy fetch error: " + err.message }) };
  }
};
