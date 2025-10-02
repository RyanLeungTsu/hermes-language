"use client";

import { useState, useEffect } from "react";

interface Card {
  native: string;
  learning: string;
}

interface FlashcardSet {
  id: string;
  name: string;
  language: string;
  nativeLanguage: string;
  firstSide: "native" | "learning";
  cards: Card[];
}

// Default flashcards
const defaultFlashcardSets: FlashcardSet[] = [
  {
    id: "1",
    name: "Basic Spanish",
    language: "Spanish",
    nativeLanguage: "English",
    firstSide: "learning",
    cards: [
      { native: "Hello", learning: "Hola" },
      { native: "Goodbye", learning: "Adiós" },
    ],
  },
  {
    id: "2",
    name: "Basic Japanese",
    language: "Japanese",
    nativeLanguage: "English",
    firstSide: "native",
    cards: [
      { native: "Thank you", learning: "Arigatou" },
      { native: "Yes", learning: "Hai" },
    ],
  },
];

export default function Flashcards() {
  const [sets, setSets] = useState<FlashcardSet[]>(defaultFlashcardSets);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [viewingSet, setViewingSet] = useState<FlashcardSet | null>(null);

  //Handling save and adding new card sets
  const handleSave = (updatedSet: FlashcardSet) => {
    setSets((prev) => prev.map((s) => (s.id === updatedSet.id ? updatedSet : s)));
    setEditingSet(null);
  };

  const addNewSet = () => {
    const newSet: FlashcardSet = {
      id: Date.now().toString(),
      name: "New Set",
      language: "Spanish",
      nativeLanguage: "English",
      firstSide: "native",
      cards: [],
    };
    setSets([...sets, newSet]);
    setEditingSet(newSet);
  };

  //Flashcards
  const FlashcardViewer = ({ set, onClose }: { set: FlashcardSet; onClose: () => void }) => {
    const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showNative, setShowNative] = useState(true);

    useEffect(() => {
      const shuffled = [...set.cards].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setShowNative(set.firstSide === "native");
      setCurrentIndex(0);
    }, [set]);

    if (shuffledCards.length === 0) return <div>No cards in this set.</div>;

    const flipCard = () => setShowNative(!showNative);
    const nextCard = () => setCurrentIndex((i) => (i + 1) % shuffledCards.length);
    const card = shuffledCards[currentIndex];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
        <div className="bg-black p-6 rounded shadow-lg w-full max-w-md">
          <div onClick={flipCard} className="cursor-pointer p-4 border rounded text-center text-xl">
            {showNative ? card.native : card.learning}
          </div>
          <button onClick={nextCard} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Next</button>
          <button onClick={onClose} className="mt-2 text-gray-500 underline">Close</button>
        </div>
      </div>
    );
  };

  //Editing Flashcards UI
  const FlashcardEdit = ({ set, onSave, onClose }: { set: FlashcardSet; onSave: (s: FlashcardSet) => void; onClose: () => void }) => {
    const [name, setName] = useState(set.name);
    const [firstSide, setFirstSide] = useState(set.firstSide);
    const [cards, setCards] = useState<Card[]>(set.cards);

    const addCard = () => setCards([...cards, { native: "", learning: "" }]);
    const updateCard = (index: number, field: "native" | "learning", value: string) => {
      const updated = [...cards];
      updated[index][field] = value;
      setCards(updated);
    };
    const save = () => {
      // this checks to make sure there is something in the card
      const validCards = cards.filter(
        (card) => card.native.trim() !== "" || card.learning.trim() !== ""
      );

      if (validCards.length === 0) {
        alert("You need at least one card with values!");
        return;
      }

      // on save it will only save cards with something in it
      onSave({ ...set, name, firstSide, cards: validCards });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
        <div className="bg-black p-6 rounded shadow-lg w-full max-w-lg">
          <input value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mb-2" placeholder="Set Name" />
          <select value={firstSide} onChange={(e) => setFirstSide(e.target.value as "native" | "learning")} className="border p-2 w-full mb-2">
            <option value="native">Native Side First</option>
            <option value="learning">Learning Side First</option>
          </select>

          {cards.map((card, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={card.native} onChange={(e) => updateCard(i, "native", e.target.value)} placeholder="Native" className="border p-1 flex-1" />
              <input value={card.learning} onChange={(e) => updateCard(i, "learning", e.target.value)} placeholder="Learning" className="border p-1 flex-1" />
            </div>
          ))}
          <button onClick={addCard} className="bg-green-500 text-white px-4 py-2 rounded mb-2">Add Card</button>
          <div className="flex gap-2">
            <button onClick={save} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // Listing Flashcards
  const FlashcardList = () => (
    <div className="flex flex-col gap-4">
      {sets.map((set) => (
        <div key={set.id} className="flex justify-between items-center p-4 border rounded">
          <span className="font-semibold">{set.name} ({set.language})</span>
          <div className="flex gap-2">
            <button onClick={() => setViewingSet(set)} className="bg-blue-500 text-white px-2 py-1 rounded">Open</button>
            <button onClick={() => setEditingSet(set)} className="px-2 py-1">⋮</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4">
      <button onClick={addNewSet} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add New Set</button>
      <FlashcardList />
      {editingSet && <FlashcardEdit set={editingSet} onSave={handleSave} onClose={() => setEditingSet(null)} />}
      {viewingSet && <FlashcardViewer set={viewingSet} onClose={() => setViewingSet(null)} />}
    </div>
  );
}
