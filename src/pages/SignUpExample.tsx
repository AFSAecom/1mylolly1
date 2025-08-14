import { useState } from 'react';
import { handleSignUp } from '../features/auth/signUp';

export default function SignUpExample() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const res = await handleSignUp({ email, password, prenom, nom });
    if (!res.ok) {
      setMsg(`Erreur (${res.step}) : ${res.error}`);
      return;
    }
    if (res.needEmailConfirmation) {
      setMsg("Inscription créée. Vérifie ta boîte mail pour confirmer l'adresse.");
      return;
    }
    setMsg('Compte et profil créés. Bienvenue !');
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Prénom" />
      <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
      <button type="submit">Créer un compte</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
