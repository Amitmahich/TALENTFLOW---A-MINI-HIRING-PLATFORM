import { useEffect, useState } from "react";
import { db } from "../../db";
import "../../styles/ProfileTab.css";

export default function ProfileTab({ candidateInput, setCandidateInput }) {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true); // initially editable

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const existing = await db.candidates
          .where("email")
          .equals(candidateInput.email)
          .first();
        if (existing) {
          setCandidateInput({ name: existing.name, email: existing.email });
          setIsEditing(false); // existing profile -> initially read-only
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [candidateInput.email, setCandidateInput]);

  const handleSave = async () => {
    if (!candidateInput.name || !candidateInput.email) {
      alert("⚠️ Please enter name and email");
      return;
    }

    try {
      const existing = await db.candidates
        .where("email")
        .equals(candidateInput.email)
        .first();

      if (existing) {
        await db.candidates.update(existing.id, {
          name: candidateInput.name,
          email: candidateInput.email,
        });
      } else {
        await db.candidates.add({
          id: crypto.randomUUID(),
          name: candidateInput.name,
          email: candidateInput.email,
          stage: null,
          jobId: null,
        });
      }

      alert("✅ Profile saved successfully!");
      setIsEditing(false); // after save, make read-only and show Edit button
    } catch (err) {
      alert("❌ Error saving profile");
    }
  };

  if (loading) return <p>⏳ Loading profile...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <div className="profile-card">
        <label>
          <strong>Name:</strong>
          <input
            type="text"
            value={candidateInput.name}
            disabled={!isEditing}
            onChange={(e) =>
              setCandidateInput({ ...candidateInput, name: e.target.value })
            }
          />
        </label>
        <label>
          <strong>Email:</strong>
          <input
            type="email"
            value={candidateInput.email}
            disabled={!isEditing}
            onChange={(e) =>
              setCandidateInput({ ...candidateInput, email: e.target.value })
            }
          />
        </label>

        {isEditing ? (
          <button onClick={handleSave}>Save Profile</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
}
