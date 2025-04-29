"use client";

import React, { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "This app changed the way I schedule my clients. Super easy to use!",
    name: "Ava Martinez",
    title: "Consultant",
  },
  {
    quote: "Fast, clean, and intuitive. Feels like Calendly but better.",
    name: "Liam Thompson",
    title: "Freelance Developer",
  },
  {
    quote: "It saved me hours of back-and-forth emailing each week.",
    name: "Sophia Lee",
    title: "Therapist",
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // 5 seconds per testimonial

    return () => clearInterval(timer);
  }, []);

  const { quote, name, title } = testimonials[index];

  return (
    <div className="bg-gray-100 p-6 rounded-lg text-center max-w-2xl mx-auto transition-all">
      <p className="text-xl italic mb-4">“{quote}”</p>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}
