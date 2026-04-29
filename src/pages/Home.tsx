import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Users, 
  HeartPulse,
  Activity,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

const homeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <HeartPulse className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">Heal Sync</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <Link to="/login" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-all">Sign In</Link>
            <Link to="/register" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={homeVariants}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <Plus size={14} /> Smart Healthcare Platform
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
                Heal Sync – Smart Healthcare, <span className="text-blue-600 italic">Seamlessly</span> Connected
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed max-w-xl mb-10">
                Book appointments, manage your health records, and connect with trusted doctors — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-blue-200 flex items-center justify-center gap-2 transition-all">
                  Book Appointment <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 rounded-2xl font-bold text-lg shadow-sm flex items-center justify-center gap-2 transition-all">
                  View Health Records
                </Link>
              </div>
            </motion.div>

            <div className="lg:w-1/2 mt-20 lg:mt-0 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-200 aspect-[4/5] max-w-md mx-auto"
              >
                <img 
                  src="/input_file_0.png" 
                  alt="Professional Doctor" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Cards */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-10 -right-4 md:-right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <Clock size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Available</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">Next Available – Today 2:30 PM, Dr. Sarah Johnson</p>
                </motion.div>

                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-10 -left-4 md:-left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
                >
                   <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    <Activity size={18} className="text-blue-600 mr-2" />
                    {"⭐".repeat(5)}
                  </div>
                  <p className="text-xs font-black text-slate-900">4.9/5 Rating</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">1200+ Reviews</p>
                </motion.div>
              </motion.div>
              
              {/* Background Shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: "10,000+", label: "Appointments Booked" },
              { val: "5,000+", label: "Registered Patients" },
              { val: "100+", label: "Professional Doctors" },
              { val: "24/7", label: "System Availability" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-black text-blue-500 mb-2">{stat.val}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight underline decoration-blue-200 underline-offset-8">Core Features</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Experience the future of healthcare management with our intelligent features.</p>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { 
                icon: <Calendar className="text-blue-600" />, 
                title: "Easy Appointment Booking", 
                desc: "Schedule calls or visits with your preferred specialists in seconds." 
              },
              { 
                icon: <FileText className="text-green-600" />, 
                title: "Digital Health Records", 
                desc: "Securely store and access your medical history anytime, anywhere." 
              },
              { 
                icon: <UserCheck className="text-purple-600" />, 
                title: "Verified Doctors", 
                desc: "Connect with a curated network of certified healthcare professionals." 
              },
              { 
                icon: <Clock className="text-orange-600" />, 
                title: "24/7 Access", 
                desc: "Manage your health around the clock with our always-on digital system." 
              }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                variants={homeVariants}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl shadow-blue-500/10 group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 lg:flex items-center gap-16">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/10">
               <img 
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
                  alt="Modern Clinic" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px]" />
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight italic">Who is Heal Sync?</h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              "Heal Sync is a smart healthcare platform that allows users to book doctor appointments and securely store medical records online. It simplifies healthcare management with fast, reliable, and user-friendly features."
            </p>
            <div className="space-y-4">
              {[
                "Instant confirmation of bookings",
                "Advanced data encryption",
                "Personalized health dashboards",
                "Collaborative care tools"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Our Premium Services</h2>
            <p className="text-blue-100 max-w-xl mx-auto">Comprehensive solutions for modern patients and healthcare providers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Online Appointment Booking",
              "Health Record Management",
              "Doctor Profiles",
              "Appointment Tracking",
              "Secure Data Storage",
              "24/7 Customer Support"
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-lg font-bold">{service}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-700 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px] -ml-48 -mb-48 opacity-50" />
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-16 underline decoration-blue-200 underline-offset-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {[
              { step: "01", title: "Register/Login", desc: "Create your secure account." },
              { step: "02", title: "Choose Doctor", desc: "Browse verified specialists." },
              { step: "03", title: "Book Appointment", desc: "Select a time that suits you." },
              { step: "04", title: "Manage Records", desc: "View history & downloads." }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-8xl font-black text-slate-50 absolute -top-10 left-1/2 -translate-x-1/2 z-0">{step.step}</div>
                <div className="relative z-10 pt-4">
                  <h3 className="text-xl font-black text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-10 right-[-30px] text-blue-200">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200">
            <Users className="text-white" size={32} />
          </div>
          <p className="text-3xl font-bold text-slate-800 leading-relaxed italic mb-10">
            "Heal Sync made managing my health so easy. Booking appointments and accessing records is now effortless."
          </p>
          <div className="flex items-center justify-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" 
              alt="User" 
              className="w-12 h-12 rounded-full border-2 border-white shadow-md shadow-blue-200"
            />
            <div className="text-left">
              <div className="font-black text-slate-900 text-lg">Alex Rivera</div>
              <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Happy Patient</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
             whileInView={{ scale: [0.95, 1] }}
             className="bg-slate-900 p-12 lg:p-24 rounded-[4rem] text-center relative overflow-hidden shadow-3xl"
          >
            <div className="relative z-10">
               <h2 className="text-4xl lg:text-7xl font-black text-white mb-10 tracking-tight leading-tight">
                Take control of your <br/> <span className="text-blue-500 underline decoration-white underline-offset-16">health today</span> with Heal Sync
              </h2>
              <Link to="/register" className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-xl shadow-2xl shadow-blue-500/20 transition-all inline-block">
                Get Started Now
              </Link>
            </div>
            {/* Shapes */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-blue-600" size={24} />
            <span className="text-xl font-black text-slate-800">Heal Sync</span>
          </div>
          <p className="text-slate-400 font-bold text-sm">© 2026 Heal Sync. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-slate-400 text-sm font-bold">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
