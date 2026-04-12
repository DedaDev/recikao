import { useState, useEffect } from "react";
import { API_BASE } from "../lib/api";

export interface Quota {
  remaining: number;
  limit: number;
}

export interface TTSState {
  text: string;
  setText: (t: string) => void;
  person: string;
  setPerson: (p: string) => void;
  loading: boolean;
  error: string;
  serverDown: boolean;
  quota: Quota | null;
  audioBase64: string | null;
  submit: () => Promise<void>;
}

export function useTTS(token: string, onLogout: () => void): TTSState {
  const [text, setText] = useState("");
  const [person, setPerson] = useState("vucic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serverDown, setServerDown] = useState(false);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/tts/health`)
      .then((r) => { if (!r.ok) setServerDown(true); })
      .catch(() => setServerDown(true));

    fetch(`${API_BASE}/tts/quota`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { onLogout(); return null; }
        return r.json();
      })
      .then((d: Quota | null) => { if (d) setQuota(d); })
      .catch(() => {});
  }, [token]);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text, person }),
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        if (data.remaining !== undefined) setQuota((q) => ({ remaining: 0, limit: q?.limit ?? 15 }));
        throw new Error(data.error ?? "Greška");
      }

      if (data.remaining !== undefined) setQuota((q) => ({ remaining: data.remaining, limit: q?.limit ?? 15 }));
      setAudioBase64(data.audio_base64 ?? null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Nešto je pošlo po krivu 😬");
    } finally {
      setLoading(false);
    }
  };

  return { text, setText, person, setPerson, loading, error, serverDown, quota, audioBase64, submit };
}
