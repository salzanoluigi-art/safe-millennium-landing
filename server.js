const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Numero WhatsApp Business
const WHATSAPP_NUMBER = '+393476840450';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint per ricevere i dati del form
app.post('/api/contact', async (req, res) => {
    const { nameOrCompany, address, phone, message, selectedPackage } = req.body;

    // Validazione base
    if (!nameOrCompany || !address || !phone) {
        return res.status(400).json({ 
            success: false,
            error: 'Campi obbligatori mancanti' 
        });
    }

    try {
        // Crea il messaggio WhatsApp formattato
        const whatsappMessage = `*Nuovo Contatto - PRESSATRICE 1525 SLIM*

👤 *Nome/Ragione Sociale:* ${nameOrCompany}
📍 *Indirizzo:* ${address}
📞 *Telefono:* ${phone}
📦 *Pacchetto Scelto:* ${selectedPackage}

💬 *Domande/Note:*
${message || 'Nessuna nota aggiuntiva'}

⏰ *Data:* ${new Date().toLocaleString('it-IT')}`;

        // Crea il link WhatsApp
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

        // Log del contatto
        console.log('Nuovo contatto ricevuto:', {
            nameOrCompany,
            address,
            phone,
            selectedPackage,
            message,
            timestamp: new Date()
        });

        // Invia risposta al client con il link WhatsApp
        res.json({ 
            success: true, 
            message: 'Richiesta inviata con successo!',
            whatsappLink: whatsappLink
        });
    } catch (error) {
        console.error('Errore nell\'elaborazione della richiesta:', error);
        res.status(500).json({ 
            success: false,
            error: 'Errore nell\'invio della richiesta. Riprova più tardi.' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

