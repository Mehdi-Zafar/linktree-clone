<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
    <!-- Hero Section -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style="color: #333">
            Get in Touch
          </h1>
          <p class="text-lg sm:text-xl text-gray-600">
            Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out through our other channels.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <!-- Contact Form -->
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <h2 class="text-2xl sm:text-3xl font-bold mb-6" style="color: #333">
              Send us a Message
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name Input -->
              <div>
                <label for="name" class="block text-sm font-semibold mb-2" style="color: #333">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                  style="color: #333"
                />
              </div>

              <!-- Email Input -->
              <div>
                <label for="email" class="block text-sm font-semibold mb-2" style="color: #333">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                  style="color: #333"
                />
              </div>

              <!-- Subject Input -->
              <div>
                <label for="subject" class="block text-sm font-semibold mb-2" style="color: #333">
                  Subject *
                </label>
                <select
                  id="subject"
                  v-model="formData.subject"
                  required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors appearance-none bg-white"
                  style="color: #333"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Message Textarea -->
              <div>
                <label for="message" class="block text-sm font-semibold mb-2" style="color: #333">
                  Message *
                </label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  required
                  rows="5"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us how we can help you..."
                  style="color: #333"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold px-6 py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                style="color: #f2f2f2"
              >
                Send Message
              </button>

              <!-- Success Message -->
              <div v-if="submitted" class="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p class="text-emerald-700 font-medium">Thank you! We'll get back to you soon.</p>
              </div>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <!-- Contact Cards -->
            <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-2" style="color: #333">Email Us</h3>
                  <p class="text-gray-600 mb-2">Our team is here to help</p>
                  <a href="mailto:support@linktree.com" class="text-emerald-500 hover:text-emerald-600 font-medium">
                    support@linktree.com
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-2" style="color: #333">Call Us</h3>
                  <p class="text-gray-600 mb-2">Mon-Fri from 8am to 5pm</p>
                  <a href="tel:+1234567890" class="text-emerald-500 hover:text-emerald-600 font-medium">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-bold mb-2" style="color: #333">Visit Us</h3>
                  <p class="text-gray-600">
                    123 Business Street<br>
                    San Francisco, CA 94102<br>
                    United States
                  </p>
                </div>
              </div>
            </div>

            <!-- Social Media Links -->
            <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-8">
              <h3 class="text-2xl font-bold mb-4" style="color: #f2f2f2">
                Follow Us
              </h3>
              <p class="text-emerald-50 mb-6">
                Stay updated with our latest news and updates
              </p>
              <div class="flex flex-wrap gap-4">
                <a href="#" class="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg class="w-6 h-6" style="color: #f2f2f2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
                <a href="#" class="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg class="w-6 h-6" style="color: #f2f2f2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" class="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg class="w-6 h-6" style="color: #f2f2f2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" class="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                  <svg class="w-6 h-6" style="color: #f2f2f2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4" style="color: #333">
            Frequently Asked Questions
          </h2>
          <p class="text-lg text-gray-600">
            Find quick answers to common questions
          </p>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span class="font-semibold text-lg" style="color: #333">{{ faq.question }}</span>
              <svg
                class="w-6 h-6 text-emerald-500 transform transition-transform"
                :class="{ 'rotate-180': openFaq === index }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              v-show="openFaq === index"
              class="px-6 py-4 bg-gray-50 border-t border-gray-200"
            >
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-gradient-to-r from-emerald-400 to-emerald-600">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4" style="color: #f2f2f2">
          Can't find what you're looking for?
        </h2>
        <p class="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
          Our support team is available 24/7 to assist you with any questions
        </p>
        <button class="bg-white hover:bg-gray-100 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-emerald-600">
          Visit Help Center
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      submitted: false,
      openFaq: null,
      faqs: [
        {
          question: 'How quickly will I receive a response?',
          answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.'
        },
        {
          question: 'What information should I include in my message?',
          answer: 'Please provide as much detail as possible about your inquiry, including your account information (if applicable), screenshots, and any error messages you may have encountered.'
        },
        {
          question: 'Do you offer phone support?',
          answer: 'Yes! Our phone support is available Monday through Friday from 8am to 5pm PST. For after-hours support, please use our email contact form.'
        },
        {
          question: 'Can I schedule a demo or consultation?',
          answer: 'Absolutely! Select "Partnership Opportunity" in the subject line, and our team will reach out to schedule a convenient time for a demo.'
        },
        {
          question: 'How do I report a technical issue?',
          answer: 'Select "Technical Support" as the subject and provide detailed information about the issue, including steps to reproduce it, browser/device information, and any error messages.'
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', this.formData);
      this.submitted = true;
      
      // Reset form after 3 seconds
      setTimeout(() => {
        this.formData = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
        this.submitted = false;
      }, 3000);
    },
    toggleFaq(index) {
      this.openFaq = this.openFaq === index ? null : index;
    }
  }
}
</script>

<style scoped>
/* Custom select arrow */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em 1.5em;
}
</style>