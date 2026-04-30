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
  Plus,
  ChevronRight,
  Stethoscope
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
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
              <HeartPulse className="text-white" size={26} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight font-display">Heal Sync</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </a>
            <a href="#services" className="hover:text-blue-600 transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/register" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-linear-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-16">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={homeVariants}
              className="lg:w-3/5"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/10 border border-blue-200/50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                <Activity size={14} className="animate-pulse" /> Precision Healthcare System
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10 font-display">
                Your health, <br/>
                <span className="text-blue-600 bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-blue-500 to-indigo-400">perfectly sync'd.</span>
              </h1>
              <p className="text-2xl text-slate-500 leading-relaxed max-w-xl mb-12 font-medium">
                Heal Sync unites your medical records, appointments, and doctors into one beautiful, secure hub. Experience healthcare that actually moves with you.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95">
                  Book A Consultation <ArrowRight size={22} />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 rounded-2xl font-black text-lg shadow-sm flex items-center justify-center gap-3 transition-all">
                  Patient Portal
                </Link>
              </div>
              
              <div className="mt-10 lg:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 border-t border-slate-100 pt-10">
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
                    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100&h=100"
                  ].map((url, i) => (
                    <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-white bg-slate-200 overflow-hidden shrink-0">
                      <img src={url} alt="User thumbnail" referrerPolicy="no-referrer" loading="eager" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-white bg-blue-600 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white tracking-tighter shrink-0">
                    +12k
                  </div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-slate-100" />
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined our Care</div>
                  <div className="text-sm font-bold text-slate-900">Highly rated by healthcare professionals</div>
                </div>
              </div>
            </motion.div>

            <div className="lg:w-2/5 mt-20 lg:mt-0 relative group">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_-15px_rgba(37,99,235,0.2)] ring-1 ring-slate-100 h-[500px] lg:h-[600px] bg-slate-100"
              >
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Healthcare Professional" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  fetchPriority="high"
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Floating UI Elements */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/50 shadow-2xl flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-blue-200">
                    <Calendar size={20} className="sm:hidden" />
                    <Calendar size={28} className="hidden sm:block" />
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Next Appointment</div>
                    <div className="text-xs sm:text-base font-bold text-slate-800">Cardiology Focus · 4 Oct, 2:00 PM</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-2 border border-white shadow-lg"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest">350+ Doctors Online</span>
                </motion.div>
              </motion.div>
              
              {/* Decorative blobs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 rounded-full blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats with Images */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
                  title: "Expert Specialists",
                  desc: "Connect with the top 5% of certified medical professionals worldwide."
                },
                { 
                  img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
                  title: "Secure Health Vault",
                  desc: "Your records are encrypted with military-grade protocols for 100% privacy."
                },
                { 
                  img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
                  title: "Instant Support",
                  desc: "Access care and resolve your health queries 24/7 with zero waiting time."
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="group"
                >
                   <div className="aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl shadow-slate-100 ring-1 ring-slate-100">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-3 font-display">{item.title}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl text-left mb-20">
            <div className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4">Care Ecosystem</div>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 font-display tracking-tight leading-[0.95]">Intuitive design <br/><span className="text-blue-600">for human well-being.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
             {/* Feature 1: Main */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-12 lg:col-span-7 bg-white rounded-[4rem] p-12 border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden relative group"
             >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-sm">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6 font-display tracking-tight">Smart Appointment <br/>Orchestration</h3>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-sm font-medium">
                    No more waiting on hold. Browse doctor profiles, read reviews, and lock in your time slot in less than a minute.
                  </p>
                </div>
                
                <div className="mt-20 relative z-10 flex flex-wrap gap-4">
                  <Link to="/register" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-colors">Start Now</Link>
                  <div className="px-8 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest">Free for Patients</div>
                </div>

                {/* Aesthetic image insert */}
                <div className="absolute -right-20 bottom-10 w-[400px] h-[400px] opacity-10 md:opacity-20 pointer-events-none">
                  <HeartPulse size={400} className="text-blue-600" />
                </div>
             </motion.div>

             {/* Feature 2: Dark */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-12 lg:col-span-5 bg-slate-900 rounded-[4rem] p-12 flex flex-col justify-between relative overflow-hidden group"
             >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 text-white rounded-3xl flex items-center justify-center mb-10 backdrop-blur-lg">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6 font-display tracking-tight leading-tight">Your Medical <br/>History, Reimagined.</h3>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-xs font-medium">
                    Every prescription, diagnosis, and report organized into a searchable, secure archive.
                  </p>
                </div>
                
                <div className="mt-12 relative z-10">
                   <div className="flex items-center gap-4 text-blue-400 font-bold">
                     <Shield Check size={20} /> End-to-end Encrypted
                   </div>
                </div>

                {/* Abstract visual */}
                <div className="absolute bottom-0 right-0 w-full h-1/2 bg-linear-to-t from-blue-600/20 to-transparent pointer-events-none" />
             </motion.div>
          </div>
        </div>
      </section>

      {/* Instant Support Dedicated Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-blue-600 rounded-[4rem] overflow-hidden flex flex-col lg:flex-row items-center">
             <div className="lg:w-1/2 p-12 lg:p-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                   <Clock size={14} /> Always Connected
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-white font-display tracking-tight leading-[0.9] mb-8">
                   Instant Support, <br/>whenever you need.
                </h2>
                <p className="text-xl text-blue-100 font-medium leading-relaxed mb-10 max-w-lg">
                   Our dedicated care team and AI assistants are available 24/7 to help you navigate your healthcare journey, troubleshoot issues, or find the right specialist.
                </p>
                <div className="flex flex-wrap gap-4">
                   <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-lg">Chat with Support</button>
                   <button className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-colors border border-blue-500/50">Help Center</button>
                </div>
             </div>
             <div className="lg:w-1/2 min-h-[400px] lg:min-h-[500px] relative overflow-hidden self-stretch bg-blue-700">
                <img 
                  src="https://images.unsplash.com/photo-1584432830635-f129c922896c?auto=format&fit=crop&q=80&w=1200" 
                  alt="Instant Support Team" 
                  className="w-full h-full object-cover absolute inset-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-transparent to-transparent hidden lg:block" />
             </div>
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-12 border-y border-slate-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 lg:gap-12 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
              {[
                { name: "MediCare", icon: <Shield size={24} /> },
                { name: "HealthPlus", icon: <HeartPulse size={24} /> },
                { name: "SafeSync", icon: <Shield size={24} /> },
                { name: "LifeGuard", icon: <Activity size={24} /> },
                { name: "BioGen", icon: <Stethoscope size={24} /> },
                { name: "AstraCare", icon: <Plus size={24} /> }
              ].map((brand, i) => (
                <div key={i} className="flex items-center gap-2 cursor-default grayscale group-hover:grayscale-0 transition-all">
                  <div className="text-slate-900">{brand.icon}</div>
                  <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">{brand.name}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* About with High Quality Image */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="lg:flex items-center gap-24">
            <div className="lg:w-1/2 relative mb-16 lg:mb-0">
               <div className="relative rounded-[4rem] overflow-hidden shadow-3xl shadow-slate-200 aspect-square group">
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200" 
                    alt="Digital Healthcare Mission" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                  
                  {/* Overlay stat */}
                  <div className="absolute bottom-10 left-10 right-10 bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white">
                     <div className="text-4xl font-black text-blue-600 font-display mb-1">99.8%</div>
                     <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Patient Satisfaction Rate</div>
                  </div>
               </div>
               
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-[80px] -z-10" />
            </div>
            <div className="lg:w-1/2">
              <div className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4">Our Core Philosophy</div>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 font-display tracking-tight leading-[0.95] mb-10">Simplifying care <br/><span className="text-blue-600">for everyone.</span></h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium">
                We believe that managing your health shouldn't be a second job. Heal Sync was born from a simple idea: that medical technology should be as intuitive as the best consumer apps.
              </p>
              
              <div className="space-y-6">
                {[
                  { t: "Human Centric", d: "Built with a focus on ease of use for all ages." },
                  { t: "Rapid Connectivity", d: "Eliminating administrative friction for doctors." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-default">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 font-display mb-1">{item.t}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="py-32 bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="lg:flex justify-between items-end mb-20">
            <div className="max-w-2xl">
              <div className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-4">Comprehensive Care</div>
              <h2 className="text-5xl lg:text-7xl font-black text-white font-display tracking-tight leading-[0.9] mb-8 lg:mb-0">A unified system <br/>for total health.</h2>
            </div>
            <Link to="/register" className="group h-16 inline-flex items-center px-10 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
              Create Free Account <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t: "Doctor Search", i: <Stethoscope size={32} /> },
              { t: "Lab Insights", i: <Activity size={32} /> },
              { t: "Appointment Sync", i: <Calendar size={32} /> },
              { t: "Secure Vault", i: <Shield size={32} /> }
            ].map((s, i) => (
              <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between hover:bg-white/10 transition-colors group cursor-default">
                <div className="text-blue-500 group-hover:scale-110 transition-transform duration-500">{s.i}</div>
                <div>
                   <h3 className="text-2xl font-black text-white font-display mb-2">{s.t}</h3>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest tracking-[0.1em]">Learn More</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
      </section>

      {/* Final CTA with Lifestyle Background */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-[4rem] overflow-hidden relative min-h-[500px] flex items-center justify-center p-8 lg:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
           <img 
              src="https://images.unsplash.com/photo-1505751172177-51ad18e39eb1?auto=format&fit=crop&q=80&w=1600" 
              alt="Healthy Lifestyle" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative z-10 text-center max-w-4xl"
           >
              <h2 className="text-5xl lg:text-8xl font-black text-white mb-10 tracking-[1px] leading-[0.9] font-display">
                Ready for a smarter <br/> health journey?
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <Link to="/register" className="h-16 inline-flex items-center justify-center px-10 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/40 transition-all hover:scale-105">
                    Join Heal Sync Now
                 </Link>
                 <Link to="/login" className="h-16 inline-flex items-center justify-center px-10 bg-white/20 backdrop-blur-lg text-white border border-white/30 rounded-2xl font-black text-lg transition-all hover:bg-white/30">
                    Sign In
                 </Link>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
             <div className="max-w-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <HeartPulse size={26} />
                  </div>
                  <span className="text-2xl font-black text-slate-900 font-display">Heal Sync</span>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed font-medium mb-8">
                  The unified healthcare operating system built for the modern patient.
                </p>
                <div className="flex gap-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                        <Activity size={18} />
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-32">
                <div>
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Platform</h4>
                   <ul className="space-y-4">
                      <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Booking</a></li>
                      <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Specialists</a></li>
                      <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Vault</a></li>
                   </ul>
                </div>
                <div>
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Resources</h4>
                   <ul className="space-y-4">
                      <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Privacy</a></li>
                      <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Terms</a></li>
                      <li><a href="#" className="text-slate-500 font-bold hover:text-blue-600 transition-colors">Compliance</a></li>
                   </ul>
                </div>
                <div className="col-span-2 lg:col-span-1">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8">Health Partner</h4>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="text-xs font-black text-blue-600 uppercase mb-2 tracking-widest">Featured Doctor</div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                           <img 
                             src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100" 
                             alt="Doctor" 
                             className="w-full h-full object-cover"
                             referrerPolicy="no-referrer" 
                           />
                        </div>
                        <div>
                           <div className="font-black text-slate-900">Dr. Sarah Johnson</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cardiology Specialist</div>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 HEAL SYNC SYSTEM · REDEFINING WELLNESS</p>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> HIPAA COMPLIANT
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> SECURE HANDSHAKE
               </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
