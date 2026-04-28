import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Bus,
  Map as MapIcon,
  Users,
  CreditCard,
  Shield,
  Zap,
  ArrowRight,
  Navigation,
  Monitor,
  ChevronDown,
  Star,
  Clock,
  Route,
  Bell,
  Smartphone,
  BarChart3,
  MapPin,
  Wifi,
  CheckCircle2,
  Play,
  GraduationCap,
  Building2,
  Award,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

/* ─────────── Animated Counter ─────────── */
const AnimatedCounter = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ─────────── Floating Particles BG ─────────── */
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: '50%',
            background: 'rgba(79, 70, 229, 0.25)'
          }}
          animate={{ y: [0, -60, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* ─────────── Animated Bus Route SVG ─────────── */
const AnimatedRoute = () => (
  <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0, left: 0, opacity: 0.08 }}>
    <motion.path
      d="M 0 250 Q 100 180 200 220 Q 300 260 400 200 Q 500 140 600 180 Q 700 220 800 160"
      fill="none" stroke="#4F46E5" strokeWidth="3"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 3, ease: 'easeInOut' }}
    />
    <motion.circle cx="0" cy="250" r="6" fill="#4F46E5"
      initial={{ cx: 0, cy: 250 }}
      animate={{
        cx: [0, 200, 400, 600, 800],
        cy: [250, 220, 200, 180, 160]
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    />
    {/* Stop markers */}
    {[
      { cx: 200, cy: 220 }, { cx: 400, cy: 200 }, { cx: 600, cy: 180 }
    ].map((s, i) => (
      <circle key={i} cx={s.cx} cy={s.cy} r="8" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5" />
    ))}
  </svg>
);

/* ─────────── LANDING PAGE ─────────── */
const LandingPage = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    { name: 'Ananya Sharma', role: 'B.Tech Computer Science, 3rd Year', text: "SmartBus completely changed my daily commute. I never miss my morning bus anymore and the live tracking is incredibly accurate.", avatar: 'AS', color: '#4F46E5' },
    { name: 'Prof. Rajesh Kumar', role: 'HOD, Mechanical Engineering', text: "The admin dashboard gives us unprecedented visibility into our fleet operations. Route optimization alone saved us 30% on fuel costs.", avatar: 'RK', color: '#10B981' },
    { name: 'Mohammed Farhan', role: 'Senior Bus Driver', text: "The Driver HUD is intuitive and the emergency SOS feature gives me peace of mind. I can focus on driving safely.", avatar: 'MF', color: '#8B5CF6' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <Navigation />, title: 'Live GPS Tracking', desc: 'Real-time satellite tracking of every bus in the fleet with sub-meter accuracy and predictive ETA.', color: '#4F46E5', tag: 'Core' },
    { icon: <Users />, title: 'Seat Availability', desc: 'Smart occupancy sensors provide live seat counts. Know if your bus is full before it arrives.', color: '#10B981', tag: 'Smart' },
    { icon: <CreditCard />, title: 'Digital Fee Wallet', desc: 'Seamless semester fee management with digital receipts, auto-reminders, and instant transactions.', color: '#8B5CF6', tag: 'Finance' },
    { icon: <Shield />, title: 'SOS Safety Network', desc: 'One-tap emergency alerts that instantly notify campus security, nearby drivers, and local authorities.', color: '#EF4444', tag: 'Safety' },
    { icon: <Zap />, title: 'AI Delay Prediction', desc: 'Machine learning models analyze traffic, weather, and historical data to predict delays 15 min ahead.', color: '#F59E0B', tag: 'AI' },
    { icon: <Monitor />, title: 'Admin Command Center', desc: 'Full fleet visibility with analytics dashboards, student management, and financial reporting tools.', color: '#3B82F6', tag: 'Admin' }
  ];

  const stats = [
    { value: 2500, suffix: '+', label: 'Students Connected', icon: <GraduationCap size={20} /> },
    { value: 45, suffix: '', label: 'Buses in Fleet', icon: <Bus size={20} /> },
    { value: 98, suffix: '%', label: 'On-Time Rate', icon: <Clock size={20} /> },
    { value: 15, suffix: '+', label: 'Routes Optimized', icon: <Route size={20} /> }
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0C10', color: '#F0F6FC', overflowX: 'hidden' }}>

      {/* ═══════ NAVBAR ═══════ */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: '16px 48px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: 'rgba(10, 12, 16, 0.75)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', padding: '10px',
            borderRadius: '14px', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
          }}>
            <Bus size={22} color="white" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '900', fontFamily: 'Outfit', letterSpacing: '-0.03em' }}>
            Smart<span style={{ background: 'linear-gradient(135deg, #4F46E5, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bus</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {[
            { label: 'Features', id: 'features' },
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'Testimonials', id: 'testimonials' }
          ].map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: 'transparent', border: 'none', color: '#C9D1D9',
                fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer',
                transition: 'color 0.2s', fontFamily: 'Inter'
              }}
              onMouseEnter={e => e.target.style.color = '#F0F6FC'}
              onMouseLeave={e => e.target.style.color = '#C9D1D9'}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={onGetStarted}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              color: '#F0F6FC', padding: '10px 22px', borderRadius: '12px',
              fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#4F46E5'; e.target.style.background = 'rgba(79,70,229,0.1)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'transparent'; }}
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="btn-primary"
            style={{ padding: '10px 22px', fontSize: '0.9rem', borderRadius: '12px' }}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </motion.nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <header style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '120px 48px 80px', overflow: 'hidden'
      }}>
        <FloatingParticles />

        {/* Gradient orbs */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(79,70,229,0.12), transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none'
        }} />

        <AnimatedRoute />

        <div style={{ maxWidth: '900px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 20px', borderRadius: '100px', marginBottom: '32px',
                background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.25)'
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}>
                <motion.div
                  style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#10B981' }}
                  animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#A5B4FC', letterSpacing: '0.05em' }}>
                UNIVERSITY TRANSIT PLATFORM
              </span>
            </motion.div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: '900',
              lineHeight: 1.05, marginBottom: '28px', fontFamily: 'Outfit', letterSpacing: '-0.03em'
            }}>
              The Future of{' '}
              <span style={{
                background: 'linear-gradient(135deg, #4F46E5, #818CF8, #10B981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Campus Mobility
              </span>
              <br />is Already Here
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: '#8B949E',
              maxWidth: '650px', margin: '0 auto 48px', lineHeight: 1.7
            }}>
              AI-powered real-time tracking, digital fee management, and emergency safety protocols — 
              all unified into one intelligent platform built for modern universities.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => onGetStarted('student')}
                style={{
                  background: 'linear-gradient(135deg, #4F46E5, #6366F1)', color: 'white',
                  border: 'none', padding: '18px 40px', borderRadius: '16px',
                  fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 8px 30px rgba(79,70,229,0.35)'
                }}
              >
                Launch Portal <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => onGetStarted('driver')}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                  border: '1px solid rgba(16, 185, 129, 0.2)', padding: '18px 40px',
                  borderRadius: '16px', fontSize: '1.05rem', fontWeight: '700',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                }}
              >
                <Bus size={18} /> Operator HUD
              </motion.button>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                display: 'flex', gap: '32px', justifyContent: 'center',
                marginTop: '56px', flexWrap: 'wrap'
              }}
            >
              {[
                { icon: <CheckCircle2 size={16} />, label: 'ISO 27001 Certified' },
                { icon: <Shield size={16} />, label: 'End-to-End Encrypted' },
                { icon: <Award size={16} />, label: 'Best Campus App 2025' }
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.82rem', color: '#6E7681', fontWeight: '500'
                }}>
                  <span style={{ color: '#4F46E5' }}>{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: '40px', left: '50%',
            transform: 'translateX(-50%)', cursor: 'pointer'
          }}
          onClick={() => scrollTo('stats')}
        >
          <ChevronDown size={28} color="#4F46E5" />
        </motion.div>
      </header>

      {/* ═══════ STATS BANNER ═══════ */}
      <section id="stats" style={{
        padding: '60px 48px',
        background: 'linear-gradient(180deg, rgba(79,70,229,0.06) 0%, transparent 100%)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px'
        }}>
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ textAlign: 'center', padding: '24px' }}
            >
              <div style={{
                display: 'inline-flex', padding: '10px', borderRadius: '12px',
                background: 'rgba(79,70,229,0.1)', marginBottom: '12px', color: '#818CF8'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '2.5rem', fontWeight: '900', fontFamily: 'Outfit',
                background: 'linear-gradient(135deg, #F0F6FC, #A5B4FC)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6E7681', fontWeight: '500', marginTop: '4px' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════ FEATURES GRID ═══════ */}
      <section id="features" style={{ padding: '120px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '72px' }}
          >
            <span style={{
              fontSize: '0.8rem', fontWeight: '700', color: '#818CF8',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block'
            }}>
              PLATFORM CAPABILITIES
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontFamily: 'Outfit',
              fontWeight: '800', marginBottom: '20px', letterSpacing: '-0.02em'
            }}>
              Everything Your Campus{' '}
              <span style={{
                background: 'linear-gradient(135deg, #4F46E5, #10B981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Transport Needs
              </span>
            </h2>
            <p style={{ color: '#6E7681', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              An end-to-end intelligent mobility platform designed specifically for university ecosystems.
            </p>
          </motion.div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px'
          }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                style={{
                  background: 'rgba(22, 27, 34, 0.6)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '20px', padding: '36px',
                  cursor: 'default', transition: 'box-shadow 0.3s, border-color 0.3s',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${f.color}40`;
                  e.currentTarget.style.boxShadow = `0 20px 40px ${f.color}12`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Corner glow */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px',
                  background: `radial-gradient(circle, ${f.color}08, transparent 70%)`,
                  borderRadius: '50%', pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    background: `${f.color}15`, padding: '14px', borderRadius: '16px',
                    color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {React.cloneElement(f.icon, { size: 24 })}
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: '700', color: f.color,
                    padding: '4px 10px', borderRadius: '20px',
                    background: `${f.color}12`, letterSpacing: '0.08em', textTransform: 'uppercase'
                  }}>
                    {f.tag}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: '700',
                  marginBottom: '12px', letterSpacing: '-0.01em'
                }}>
                  {f.title}
                </h3>
                <p style={{ color: '#6E7681', fontSize: '0.92rem', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="how-it-works" style={{
        padding: '120px 48px',
        background: 'linear-gradient(180deg, rgba(79,70,229,0.03) 0%, transparent 50%)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <span style={{
              fontSize: '0.8rem', fontWeight: '700', color: '#818CF8',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block'
            }}>
              SIMPLE ONBOARDING
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontFamily: 'Outfit',
              fontWeight: '800', letterSpacing: '-0.02em'
            }}>
              Get Moving in{' '}
              <span style={{
                background: 'linear-gradient(135deg, #10B981, #4F46E5)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                3 Simple Steps
              </span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{
              position: 'absolute', top: '60px', left: '15%', right: '15%',
              height: '2px', background: 'linear-gradient(90deg, #4F46E5, #10B981, #8B5CF6)',
              opacity: 0.2
            }} />

            {[
              { step: '01', title: 'Sign Up', desc: 'Register with your university ID and get instant portal access.', icon: <GraduationCap size={28} />, color: '#4F46E5' },
              { step: '02', title: 'Track Your Bus', desc: 'View live GPS locations, ETAs, and seat availability in real-time.', icon: <MapPin size={28} />, color: '#10B981' },
              { step: '03', title: 'Ride Smart', desc: 'Pay digitally, get alerts, and enjoy AI-optimized campus transit.', icon: <Smartphone size={28} />, color: '#8B5CF6' }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: '80px', height: '80px', borderRadius: '24px',
                    background: `linear-gradient(135deg, ${s.color}20, ${s.color}08)`,
                    border: `2px solid ${s.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', color: s.color
                  }}
                >
                  {s.icon}
                </motion.div>
                <div style={{
                  fontSize: '0.75rem', fontWeight: '800', color: s.color,
                  marginBottom: '8px', letterSpacing: '0.1em'
                }}>
                  STEP {s.step}
                </div>
                <h3 style={{
                  fontSize: '1.3rem', fontFamily: 'Outfit', fontWeight: '700', marginBottom: '12px'
                }}>
                  {s.title}
                </h3>
                <p style={{ color: '#6E7681', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section id="testimonials" style={{
        padding: '120px 48px',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <span style={{
              fontSize: '0.8rem', fontWeight: '700', color: '#818CF8',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', display: 'block'
            }}>
              CAMPUS VOICES
            </span>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontFamily: 'Outfit', fontWeight: '800',
              letterSpacing: '-0.02em'
            }}>
              Loved by{' '}
              <span style={{
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                Everyone on Campus
              </span>
            </h2>
          </motion.div>

          <div style={{ position: 'relative', minHeight: '240px' }}>
            <AnimatePresence mode="wait">
              {testimonials.map((t, i) => i === activeTestimonial && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: 'rgba(22, 27, 34, 0.5)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '24px',
                    padding: '48px', textAlign: 'center', position: 'absolute', width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                    {[...Array(5)].map((_, s) => <Star key={s} size={18} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                  <p style={{
                    fontSize: '1.15rem', lineHeight: 1.7, color: '#C9D1D9',
                    marginBottom: '32px', fontStyle: 'italic'
                  }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '800', fontSize: '0.9rem', color: 'white'
                    }}>
                      {t.avatar}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#6E7681' }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '280px' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                style={{
                  width: i === activeTestimonial ? '32px' : '10px', height: '10px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: i === activeTestimonial ? '#4F46E5' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section style={{ padding: '120px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(16,185,129,0.05))',
          pointerEvents: 'none'
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{
            maxWidth: '800px', margin: '0 auto', textAlign: 'center',
            position: 'relative', zIndex: 1
          }}
        >
          <div style={{
            display: 'inline-flex', padding: '12px', background: 'rgba(79,70,229,0.1)',
            borderRadius: '20px', marginBottom: '28px'
          }}>
            <Bus size={32} color="#4F46E5" />
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'Outfit',
            fontWeight: '900', marginBottom: '20px', letterSpacing: '-0.03em'
          }}>
            Ready to Transform{' '}
            <span style={{
              background: 'linear-gradient(135deg, #4F46E5, #10B981)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Campus Transit?
            </span>
          </h2>
          <p style={{
            fontSize: '1.15rem', color: '#6E7681', marginBottom: '48px',
            maxWidth: '500px', margin: '0 auto 48px', lineHeight: 1.7
          }}>
            Join thousands of students, drivers, and administrators already using SmartBus for a safer, faster campus commute.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
              onClick={onGetStarted}
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white',
                border: 'none', padding: '20px 48px', borderRadius: '18px',
                fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '12px',
                boxShadow: '0 8px 40px rgba(79,70,229,0.4)',
                fontFamily: 'Outfit', letterSpacing: '-0.01em'
              }}
            >
              Access University Portal <ArrowUpRight size={22} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{
        padding: '60px 48px', borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(10,12,16,0.6)'
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px'
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                padding: '8px', borderRadius: '12px'
              }}>
                <Bus size={20} color="white" />
              </div>
              <span style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.2rem' }}>
                Smart<span style={{ color: '#4F46E5' }}>Bus</span>
              </span>
            </div>
            <p style={{ color: '#484F58', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px' }}>
              AI-powered campus transit management. Built for modern universities that demand excellence.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: ['Features', 'Security', 'Pricing', 'API Docs'] },
            { title: 'University', links: ['About', 'Partners', 'Campus Map', 'Contact'] },
            { title: 'Support', links: ['Help Center', 'IT Helpdesk', 'Bug Report', 'Status'] }
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{
                fontSize: '0.8rem', fontWeight: '700', color: '#6E7681',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px'
              }}>
                {col.title}
              </h4>
              {col.links.map((link, j) => (
                <div key={j} style={{
                  color: '#484F58', fontSize: '0.9rem', marginBottom: '10px',
                  cursor: 'pointer', transition: 'color 0.2s'
                }}
                  onMouseEnter={e => e.target.style.color = '#C9D1D9'}
                  onMouseLeave={e => e.target.style.color = '#484F58'}
                >
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          maxWidth: '1200px', margin: '48px auto 0', paddingTop: '24px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '0.82rem', color: '#30363D'
        }}>
          <span>© 2026 SmartBus. All rights reserved.</span>
          <span>Built for Modern Universities</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
