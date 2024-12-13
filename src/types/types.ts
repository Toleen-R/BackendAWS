// Definierar en användargränssnitt som beskriver användarens egenskaper och deras relation till kampanjer
export interface User {
  id: string; // Unikt ID för användaren
  name: string; // Användarens namn
  email: string; // Användarens e-postadress
  password: string; // Användarens lösenord (bör vara hashad i praktiken)
  campaign: Campaign[]; // Lista över kampanjer associerade med användaren
}

// Utökar Express' inbyggda User-gränssnitt med ytterligare egenskaper
declare global {
  namespace Express {
    interface User {
      id: string; // Användarens unika ID
      email: string; // Användarens e-postadress
      name: string; // Användarens namn
    }
  }
}

// Definierar en e-postgränssnitt för e-postmeddelanden i kampanjer
export interface Email {
  id: string; // Unikt ID för e-postmeddelandet
  subject: string; // Ämnet för e-postmeddelandet
  content: string; // Innehållet i e-postmeddelandet
  campaignId: string; // ID för den associerade kampanjen
  campaign: Campaign[]; // Lista över associerade kampanjer (kan vara överflödigt om endast en kampanj är associerad)
  recipients: string[]; // Lista över mottagares e-postadresser
}

// Definierar en kampanjgränssnitt som beskriver kampanjens egenskaper
export interface Campaign {
  id: string; // Unikt ID för kampanjen
  companyName: string; // Företagets namn
  companyDescription: string; // Beskrivning av företaget
  productDescription: string; // Beskrivning av produkten
  targetAudience: string; // Målgrupp för kampanjen
  userId: string; // ID för användaren som äger kampanjen
  user: User; // Användaren som är associerad med kampanjen
  emails: Email[]; // Lista över e-postmeddelanden som hör till kampanjen
}

// Beskriver strukturen för en begäran som skickas för att skapa en kampanj
export interface RequestCampaign {
  companyName: string; // Företagets namn
  companyDescription: string; // Företagsbeskrivning
  productDescription: string; // Produktbeskrivning
  targetAudience: string; // Målgrupp
  createdAtDate: string; // Datum för skapandet av kampanjen
  userId: string; // ID för användaren som skapar kampanjen
  emails: {
    subject: string; // Ämne för e-post
    content: string; // Innehåll för e-post
    recipients: string[]; // Lista över mottagares e-postadresser
  }[]; // Lista över e-postmeddelanden som ska skapas med kampanjen
}

// Beskriver strukturen för en begäran om att skapa en ny användare
export interface RequestUser {
  name: string; // Användarens namn
  email: string; // Användarens e-postadress
  password: string; // Användarens lösenord
}

// Gränssnitt för att beskriva en användarprofil från GitHub-strategin
export interface UserProfile {
  id: string; // GitHub-användarens ID
  username: string; // Användarens användarnamn
  displayName: string; // Användarens visningsnamn
  profileUrl: string; // URL till användarens profil
  emails: Array<{ value: string }>; // Lista över användarens e-postadresser
}
