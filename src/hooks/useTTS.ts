import { useState, useEffect } from "react";
import { HTTPError } from "ky";
import { authApi } from "../lib/api";

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
  quota: Quota | null;
  audioBase64: string | null;
  submit: () => Promise<void>;
}

export function useTTS(token: string, onLogout: () => void): TTSState {
  const [text, setText] = useState("");
  const [person, setPerson] = useState("vucic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quota, setQuota] = useState<Quota | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  useEffect(() => {
    authApi(token).get("tts/quota").json<Quota>()
      .then(setQuota)
      .catch(async (e) => {
        if (e instanceof HTTPError && e.response.status === 401) onLogout();
      });
  }, [token]);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const data = await authApi(token).post("tts", { json: { text, person } })
        .json<{ audio_base64: string; remaining?: number }>();

      if (data.remaining !== undefined)
        setQuota((q) => ({ remaining: data.remaining!, limit: q?.limit ?? 15 }));
      setAudioBase64(data.audio_base64 ?? null);
    } catch (e) {
      if (e instanceof HTTPError) {
        if (e.response.status === 401) { onLogout(); return; }
        const data = await e.response.json().catch(() => ({})) as { error?: string; remaining?: number };
        if (data.remaining !== undefined) setQuota((q) => ({ remaining: 0, limit: q?.limit ?? 15 }));
        setError(data.error ?? "Greška");
      } else {
        setError("Nešto je pošlo po krivu 😬");
      }
    } finally {
      setLoading(false);
    }
  };

  return { text, setText, person, setPerson, loading, error, quota, audioBase64, submit };
}
