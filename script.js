// Supabase Configuration
const supabaseUrl = 'https://rjgotbruhdursgcvnvaw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZ290YnJ1aGR1cnNnY3ZudmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMDY0ODIsImV4cCI6MjA2MTY4MjQ4Mn0.n6qLoWlDESyF51hRreY983ZTTjIVuqIzZOXaP7rWVAg';
const supabase = createClient(supabaseUrl, supabaseKey);

// Form submission handler
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value;
    const device = document.getElementById('device').value;
    const iccid = document.getElementById('iccid').value;
    const message = document.getElementById('message').value;

    // Simple validation
    if (!fullName || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        // Save to Supabase
        const { data, error } = await supabase
            .from('contact_form')
            .insert([
                {
                    full_name: fullName,
                    email: email,
                    phone: countryCode + phone,
                    device: device,
                    iccid: iccid,
                    message: message
                }
            ]);
        
        if (error) throw error;

        // Send to WhatsApp
        const whatsappMessage = `New Contact Form Submission:\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${countryCode}${phone}\nDevice: ${device}\nICCID: ${iccid}\nMessage: ${message}`;
        const whatsappUrl = `https://wa.me/26788894827?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Send to email
        const emailSubject = `New Contact from ${fullName}`;
        const emailBody = `New contact form submission:\n\n${JSON.stringify({
            name: fullName,
            email: email,
            phone: countryCode + phone,
            device: device,
            iccid: iccid,
            message: message
        }, null, 2)}`;
        const emailUrl = `mailto:kamanombemorgan@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Open email client
        window.location.href = emailUrl;
        
        // Show success message
        alert('Thank you for your message! We will contact you shortly.');
        
        // Reset form
        e.target.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your form. Please try again.');
    }
});

// Chatbot interaction logger (optional)
async function logChatbotInteraction(userMessage, botResponse) {
    try {
        const { data, error } = await supabase
            .from('chatbot_interactions')
            .insert([
                {
                    user_message: userMessage,
                    bot_response: botResponse
                }
            ]);
        
        if (error) console.error('Error logging chatbot interaction:', error);
    } catch (error) {
        console.error('Error logging to Supabase:', error);
    }
}