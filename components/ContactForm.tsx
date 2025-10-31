"use client"

import React, { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mic, Send, MicOff } from "lucide-react"

type ContactFormProps = {
  data: {
    title: string
    subtitle: string
    form: {
      name: string
      email: string
      phone: string
      voicePrompt: string
      voiceListening: string
      voiceTranscript: string
      submit: string
    }
  }
}

export default function ContactForm({ data }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    brief: "",
  })
  const [isListening, setIsListening] = useState(false)
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device (iOS/Android)
  React.useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    setIsMobile(/android|iphone|ipad|ipod/i.test(ua));
  }, []);

  // ✅ Handle form submission (Formspree)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("https://formspree.io/f/movkkzry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("✅ Το μήνυμά σου στάλθηκε με επιτυχία!")
        setFormData({
          name: "",
          email: "",
          phone: "",
          brief: "",
        })
      } else {
        alert("⚠️ Υπήρξε σφάλμα στην αποστολή. Προσπάθησε ξανά.")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("⚠️ Σφάλμα σύνδεσης. Έλεγξε τη σύνδεσή σου στο internet.")
    }
  }

  // ✅ Toggle speech recognition (start/stop)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Η αναγνώριση φωνής δεν υποστηρίζεται στον browser σας.");
      return;
    }

    // On mobile: toggle start/stop on each tap
    if (isMobile) {
      if (isListening && recognitionInstance) {
        recognitionInstance.stop();
        setIsListening(false);
        return;
      }
    } else {
      // On desktop: stop if already listening
      if (isListening && recognitionInstance) {
        recognitionInstance.stop();
        setIsListening(false);
        return;
      }
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    setRecognitionInstance(recognition);

    recognition.lang = "el-GR";
    recognition.continuous = false;
    recognition.interimResults = true;

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      const combined = finalTranscript || interimTranscript;
      if (combined.trim()) {
        setFormData((prev) => ({ ...prev, brief: combined.trim() }));
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
      try {
        recognition.stop();
      } catch {}
      alert("⚠️ Πρόβλημα με το μικρόφωνο ή την αναγνώριση φωνής.");
    };

    recognition.onend = () => {
      if (finalTranscript.trim()) {
        setFormData((prev) => ({
          ...prev,
          brief: prev.brief
            ? `${prev.brief.trim()} ${finalTranscript.trim()}`
            : finalTranscript.trim(),
        }));
      }
      setIsListening(false);
    };

    recognition.start();
  };

  const { title, subtitle, form } = data

  return (
    <section
      id="contact"
      className="py-20 px-4 bg-gradient-to-br from-brand-navy/10 via-brand-teal/10 to-brand-navy/5 relative overflow-hidden"
    >
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-teal/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-brand-navy/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-navy">
            {title}
          </h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium text-brand-navy">
              {form.name}
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="h-12 text-base"
              placeholder="Το όνομά σου"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium text-brand-navy">
              {form.email}
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className="h-12 text-base"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-base font-medium text-brand-navy">
              {form.phone}
            </Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              className="h-12 text-base"
              placeholder="+30 123 456 7890"
            />
          </div>

          {/* Voice Input */}
          <div className="space-y-4">
            <Label className="text-base font-medium text-brand-navy">Περιγραφή Project</Label>

            <div
              className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all ${
                isListening ? "border-brand-teal bg-brand-teal/5" : "border-gray-200"
              }`}
            >
              <button type="button" onClick={handleVoiceInput} className="relative group">
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-red-500" />
                    <div className="absolute inset-0 rounded-full animate-pulse opacity-50 bg-red-500" />
                  </>
                )}
                <div
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
                    isListening ? "bg-red-500" : "bg-brand-navy"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-12 h-12 text-white animate-pulse" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </div>
              </button>

              <p
                className={`mt-6 text-center font-medium ${
                  isListening ? "text-red-500" : "text-brand-navy"
                }`}
              >
                {isListening
                  ? isMobile
                    ? "Πατήστε ξανά στο μικρόφωνο για να σταματήσει η ηχογράφηση"
                    : "Πατήστε ξανά για να σταματήσει η ηχογράφηση"
                  : form.voicePrompt}
              </p>
            </div>

            {/* Transcript */}
            {formData.brief && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm font-medium mb-2 text-brand-navy">
                  {form.voiceTranscript}
                </p>
                <p className="text-gray-700">{formData.brief}</p>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, brief: "" }))}
                  className="text-sm mt-2 underline text-brand-teal"
                >
                  Καθαρισμός
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold gap-2 bg-brand-teal text-brand-navy hover:bg-brand-teal/90"
          >
            <Send className="h-5 w-5" />
            {form.submit}
          </Button>
        </form>
      </div>
    </section>
  )
}

