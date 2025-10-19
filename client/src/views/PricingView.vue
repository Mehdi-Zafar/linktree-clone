<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
    <!-- Hero Section -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style="color: #333">
            Simple, Transparent Pricing
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 mb-8">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>

          <!-- Billing Toggle -->
          <div class="inline-flex items-center bg-white rounded-full p-1 shadow-lg">
            <button
              @click="billingCycle = 'monthly'"
              :class="billingCycle === 'monthly' ? 'bg-emerald-500 text-white' : 'text-gray-600'"
              class="px-6 py-2 rounded-full font-semibold transition-all duration-300"
              style="color: inherit"
            >
              Monthly
            </button>
            <button
              @click="billingCycle = 'yearly'"
              :class="billingCycle === 'yearly' ? 'bg-emerald-500 text-white' : 'text-gray-600'"
              class="px-6 py-2 rounded-full font-semibold transition-all duration-300"
              style="color: inherit"
            >
              Yearly
              <span class="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
                >Save 20%</span
              >
            </button>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <!-- Free Plan -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
          >
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold mb-2" style="color: #333">Free</h3>
              <p class="text-gray-600 mb-6">Perfect for getting started</p>
              <div class="mb-6">
                <span class="text-5xl font-bold" style="color: #333">$0</span>
                <span class="text-gray-600">/month</span>
              </div>
              <button
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Unlimited links</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Basic analytics</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">5 themes</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">LinkTree branding</span>
              </div>
            </div>
          </div>

          <!-- Pro Plan (Most Popular) -->
          <div
            class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-2xl p-8 transform lg:scale-105 relative border-4 border-emerald-400"
          >
            <div
              class="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-bl-lg rounded-tr-lg font-bold text-sm"
            >
              MOST POPULAR
            </div>
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold mb-2" style="color: #f2f2f2">Pro</h3>
              <p class="text-emerald-100 mb-6">For serious creators</p>
              <div class="mb-6">
                <span class="text-5xl font-bold" style="color: #f2f2f2">
                  ${{ billingCycle === 'monthly' ? '12' : '10' }}
                </span>
                <span class="text-emerald-100">/month</span>
              </div>
              <button
                class="w-full bg-white hover:bg-gray-100 text-emerald-600 font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Free Trial
              </button>
            </div>

            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 mr-3 flex-shrink-0"
                  style="color: #f2f2f2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-emerald-50">SEO optimization</span>
              </div>
            </div>
          </div>

          <!-- Enterprise Plan -->
          <div
            class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-100"
          >
            <div class="text-center mb-8">
              <h3 class="text-2xl font-bold mb-2" style="color: #333">Enterprise</h3>
              <p class="text-gray-600 mb-6">For teams and businesses</p>
              <div class="mb-6">
                <span class="text-5xl font-bold" style="color: #333">
                  ${{ billingCycle === 'monthly' ? '49' : '40' }}
                </span>
                <span class="text-gray-600">/month</span>
              </div>
              <button
                class="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                style="color: #f2f2f2"
              >
                Contact Sales
              </button>
            </div>

            <div class="space-y-4">
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Everything in Pro, plus:</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Custom domain</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Team collaboration (5 users)</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Advanced integrations</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">White-label solution</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">Dedicated account manager</span>
              </div>
              <div class="flex items-start">
                <svg
                  class="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="text-gray-600">99.99% SLA uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Comparison Table -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4" style="color: #333">Compare Plans</h2>
          <p class="text-lg text-gray-600">See what's included in each plan</p>
        </div>

        <div class="max-w-5xl mx-auto overflow-x-auto">
          <table class="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead class="bg-emerald-500">
              <tr>
                <th class="px-6 py-4 text-left font-semibold" style="color: #f2f2f2">Features</th>
                <th class="px-6 py-4 text-center font-semibold" style="color: #f2f2f2">Free</th>
                <th class="px-6 py-4 text-center font-semibold" style="color: #f2f2f2">Pro</th>
                <th class="px-6 py-4 text-center font-semibold" style="color: #f2f2f2">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(feature, index) in comparisonFeatures"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 font-medium" style="color: #333">{{ feature.name }}</td>
                <td class="px-6 py-4 text-center">
                  <span v-if="feature.free === true" class="text-emerald-500">
                    <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span v-else-if="feature.free === false" class="text-gray-300">
                    <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span v-else class="text-gray-600 text-sm">{{ feature.free }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span v-if="feature.pro === true" class="text-emerald-500">
                    <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span v-else-if="feature.pro === false" class="text-gray-300">
                    <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span v-else class="text-gray-600 text-sm">{{ feature.pro }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span v-if="feature.enterprise === true" class="text-emerald-500">
                    <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span v-else-if="feature.enterprise === false" class="text-gray-300">
                    <svg class="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span v-else class="text-gray-600 text-sm">{{ feature.enterprise }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 md:py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4" style="color: #333">
            Frequently Asked Questions
          </h2>
          <p class="text-lg text-gray-600">Everything you need to know about pricing</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden"
          >
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
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <div v-show="openFaq === index" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold mb-4" style="color: #333">
            Loved by Creators Worldwide
          </h2>
          <p class="text-lg text-gray-600">See what our users have to say</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="flex items-center mb-4">
              <div class="flex text-yellow-400">
                <svg
                  v-for="star in 5"
                  :key="star"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  ></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-600 mb-6 leading-relaxed">{{ testimonial.text }}</p>
            <div class="flex items-center">
              <div
                class="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center mr-4"
              >
                <span class="text-emerald-700 font-bold text-lg">{{ testimonial.initial }}</span>
              </div>
              <div>
                <p class="font-bold" style="color: #333">{{ testimonial.name }}</p>
                <p class="text-sm text-gray-500">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-gradient-to-r from-emerald-400 to-emerald-600">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" style="color: #f2f2f2">
          Ready to Level Up?
        </h2>
        <p class="text-lg sm:text-xl mb-8 text-emerald-50 max-w-2xl mx-auto">
          Start your 14-day free trial today. No credit card required.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            class="bg-white hover:bg-gray-100 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-emerald-600 w-full sm:w-auto"
          >
            Start Free Trial
          </button>
          <button
            class="bg-transparent border-2 border-white hover:bg-white hover:text-emerald-600 font-semibold px-8 py-4 rounded-full transition-all duration-300 w-full sm:w-auto"
            style="color: #f2f2f2"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PricingPage',
  data() {
    return {
      billingCycle: 'monthly',
      openFaq: null,
      comparisonFeatures: [
        { name: 'Unlimited Links', free: true, pro: true, enterprise: true },
        { name: 'Basic Analytics', free: true, pro: true, enterprise: true },
        { name: 'Themes', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Remove Branding', free: false, pro: true, enterprise: true },
        { name: 'Advanced Analytics', free: false, pro: true, enterprise: true },
        { name: 'Custom Buttons', free: false, pro: true, enterprise: true },
        { name: 'SEO Optimization', free: false, pro: true, enterprise: true },
        { name: 'Priority Support', free: false, pro: true, enterprise: true },
        { name: 'Custom Domain', free: false, pro: false, enterprise: true },
        { name: 'Team Collaboration', free: false, pro: false, enterprise: '5 users' },
        { name: 'White-label', free: false, pro: false, enterprise: true },
        { name: 'Dedicated Manager', free: false, pro: false, enterprise: true },
      ],
      faqs: [
        {
          question: 'Can I change plans at any time?',
          answer:
            "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits.",
        },
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans.',
        },
        {
          question: 'Is there a discount for annual billing?',
          answer:
            "Yes! When you choose annual billing, you save 20% compared to monthly billing. That's like getting 2 months free!",
        },
        {
          question: 'What happens after my free trial ends?',
          answer:
            "After your 14-day free trial, you'll be automatically billed for your selected plan unless you cancel. You can cancel anytime during the trial with no charges.",
        },
        {
          question: 'Can I get a refund?',
          answer:
            "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us within 30 days for a full refund.",
        },
        {
          question: 'Do you offer non-profit or student discounts?',
          answer:
            'Yes! We offer 50% discounts for verified non-profit organizations and students. Contact our sales team with proof of eligibility.',
        },
      ],
      testimonials: [
        {
          initial: 'S',
          name: 'Sarah Miller',
          role: 'Content Creator',
          text: 'The Pro plan has everything I need to manage my links professionally. The analytics are incredible and help me understand my audience better.',
        },
        {
          initial: 'M',
          name: 'Michael Torres',
          role: 'Entrepreneur',
          text: 'Switching to the Enterprise plan was a game-changer for our team. The custom domain and white-label features are worth every penny.',
        },
        {
          initial: 'E',
          name: 'Emily Chen',
          role: 'Social Media Manager',
          text: "I started with the free plan and upgraded to Pro within a week. The advanced features have helped me grow my client's reach significantly.",
        },
      ],
    }
  },
  methods: {
    toggleFaq(index) {
      this.openFaq = this.openFaq === index ? null : index
    },
  },
}
</script>

<style scoped>
/* Smooth transitions for FAQ */
</style>
