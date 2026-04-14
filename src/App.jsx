import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { loadSlim } from '@tsparticles/slim'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Bot,
  BriefcaseBusiness,
  Camera,
  Globe,
  Link2,
  Mail,
  MessageCircle,
  Moon,
  Sun,
  UserRound,
  WandSparkles,
  X,
} from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'

function RotatingServer() {
  const mesh = useRef(null)
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.35
    mesh.current.rotation.y = state.clock.elapsedTime * 0.45
    mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15
  })
  return (
    <Float speed={2} floatIntensity={0.9}>
      <mesh ref={mesh}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.65} roughness={0.2} />
      </mesh>
    </Float>
  )
}

const botReplies = {
  'what skills do you have?':
    'I work with AWS, CI/CD, Kubernetes, Docker, Terraform, Monitoring, Prompt Engineering, and Generative AI workflows.',
  'explain your projects':
    'I have delivered CI/CD pipelines, GitOps with ArgoCD, multi-cloud IaC using Terraform, and scalable microservices deployments.',
  'what is devops?':
    'DevOps is the culture and set of practices that unify development and operations for faster, reliable software delivery.',
  'how to contact you?':
    'You can contact me from the form below or through GitHub, LinkedIn, Instagram, and WhatsApp.',
}

const staticProjects = [
  {
    title: 'CI/CD Pipeline',
    description: 'AWS + Jenkins + Docker pipeline with secure DevSecOps scanning using Trivy.',
    tech: ['AWS', 'Jenkins', 'Docker', 'Trivy'],
  },
  {
    title: 'Kubernetes GitOps',
    description: 'Production-style GitOps delivery model powered by ArgoCD and declarative manifests.',
    tech: ['Kubernetes', 'ArgoCD', 'GitOps'],
  },
  {
    title: 'Terraform Multi-Cloud',
    description: 'Reusable infrastructure modules provisioned across providers with policy checks.',
    tech: ['Terraform', 'IaC', 'Cloud'],
  },
  {
    title: 'Microservices Deployment',
    description: 'Containerized microservices with observability, autoscaling, and rollout strategies.',
    tech: ['Docker', 'Kubernetes', 'Monitoring'],
  },
]

export default function App() {
  const [particlesReady, setParticlesReady] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [loading, setLoading] = useState(true)
  const [typingIndex, setTypingIndex] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi, I am DevOps Assistant 🤖. Ask me anything about skills, projects, or DevOps.' },
  ])
  const [repos, setRepos] = useState([])
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setParticlesReady(true))
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    const words = ['CI/CD', 'Kubernetes', 'Cloud', 'Automation']
    const timer = setInterval(() => {
      setTypingIndex((value) => (value + 1) % words.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('https://api.github.com/users/Sudarshan-Mane-2004/repos?sort=updated&per_page=4')
      .then((res) => res.json())
      .then((data) => setRepos(Array.isArray(data) ? data : []))
      .catch(() => setRepos([]))
  }, [])

  const particleOptions = useMemo(
    () => ({
      background: { color: 'transparent' },
      particles: {
        color: { value: ['#38bdf8', '#818cf8', '#ffffff'] },
        links: { enable: false },
        move: { direction: 'none', enable: true, outModes: { default: 'out' }, speed: 0.5 },
        number: { value: 45 },
        opacity: { value: 0.25 },
        size: { value: { min: 1, max: 3 } },
      },
    }),
    [],
  )

  const sendMessage = () => {
    if (!input.trim()) return
    const normalized = input.toLowerCase().trim()
    setMessages((prev) => [...prev, { role: 'user', text: input }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: botReplies[normalized] || 'Great question. I can explain skills, projects, DevOps basics, and contact details.' },
      ])
    }, 500)
  }

  return (
    <main className="relative overflow-hidden bg-hero-gradient text-white">
      <motion.div className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-cyan-300" style={{ scaleX: progress }} />
      {particlesReady && <Particles className="fixed inset-0 -z-10" options={particleOptions} />}
      {loading && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
          <motion.div animate={{ scale: [0.9, 1.08, 1], opacity: [0.45, 1, 0.95] }} transition={{ repeat: Infinity, duration: 2 }} className="text-2xl font-semibold tracking-tight">
            Sudarshan Mane
          </motion.div>
        </motion.div>
      )}

      <nav className="glass fixed left-1/2 top-4 z-40 flex w-[92%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full px-5 py-3">
        <span className="text-sm font-medium">Sudarshan Mane</span>
        <div className="hidden gap-5 text-sm text-slate-200 md:flex">
          {['about', 'experience', 'skills', 'projects', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} className="capitalize transition hover:text-cyan-300">{id}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href="/resume.pdf" className="hidden rounded-full border border-cyan-200/40 px-4 py-2 text-xs md:block">Resume</a>
          <button onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} className="rounded-full p-2 text-cyan-300">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      <section className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-24 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mb-3 text-cyan-300">AWS & DevOps Engineer</p>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Hi, I&apos;m Sudarshan Mane</h1>
          <p className="mt-5 text-xl text-slate-300">Building reliable cloud infrastructure and automated deployment systems.</p>
          <p className="mt-4 text-cyan-200">{`${['CI/CD', 'Kubernetes', 'Cloud', 'Automation'][typingIndex]} | Kubernetes | Cloud | Automation`}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}>View Projects</Button>
            <Button variant="ghost" onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact Me</Button>
          </div>
        </motion.div>
        <motion.div className="h-[360px]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[2, 2, 2]} intensity={2} />
            <RotatingServer />
          </Canvas>
        </motion.div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 py-16">
        <Card className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="section-title">About</h2>
            <p className="mt-4 text-slate-300">AWS & DevOps Engineer with hands-on experience in CI/CD automation, cloud deployments, container orchestration, and security-first delivery pipelines.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center"><p className="text-4xl font-semibold text-cyan-300">24+</p><p className="text-sm text-slate-300">Projects Completed</p></Card>
            <Card className="text-center"><p className="text-4xl font-semibold text-cyan-300">40+</p><p className="text-sm text-slate-300">Technologies Learned</p></Card>
          </div>
        </Card>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Experience</h2>
        <div className="mt-8 border-l border-cyan-300/40 pl-6">
          <Card>
            <p className="text-cyan-300">Cravita Tech</p>
            <h3 className="mt-1 text-xl">AWS & DevOps Intern</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>- Built CI/CD pipelines for faster delivery</li>
              <li>- Managed AWS deployments and service reliability</li>
              <li>- Implemented Docker and Kubernetes workflows</li>
              <li>- Added DevSecOps checks with Trivy scanning</li>
            </ul>
          </Card>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Skills</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Cloud', 'DevOps', 'Containers', 'IaC', 'Programming', 'Monitoring', 'Prompt Engineering', 'Generative AI'].map((skill) => (
            <Card key={skill} className="transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60">
              <p className="font-medium">{skill}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div className="h-full bg-cyan-300" initial={{ width: 0 }} whileInView={{ width: `${75 + Math.floor(Math.random() * 20)}%` }} viewport={{ once: true }} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="projects" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Projects</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {staticProjects.map((project) => (
            <Card key={project.title} className="transition duration-300 hover:-translate-y-1 hover:shadow-glow">
              <h3 className="text-xl">{project.title}</h3>
              <p className="mt-2 text-slate-300">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span key={item} className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs text-cyan-200">{item}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <h3 className="mt-12 text-2xl font-medium">Live GitHub Repositories</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <Card key={repo.id}>
              <h4 className="text-lg">{repo.name}</h4>
              <p className="mt-2 line-clamp-2 text-sm text-slate-300">{repo.description || 'No description available.'}</p>
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-cyan-300">
                <Globe size={16} /> Open Repository
              </a>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Education</h2>
        <Card className="mt-6">
          <p className="font-medium">Bachelor of Engineering</p>
          <p className="text-slate-300">Specialized in cloud computing, automation, and modern software delivery.</p>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Interests & Soft Skills</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {['Problem Solving', 'Collaboration', 'System Design', 'Continuous Learning'].map((interest) => (
            <Card key={interest} className="text-center transition hover:border-cyan-300/60">
              <WandSparkles className="mx-auto mb-2 text-cyan-300" size={20} />
              <p>{interest}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="section-title">Contact</h2>
        <Card className="mt-6">
          <form className="grid gap-4">
            <input className="rounded-xl border border-white/20 bg-white/5 px-4 py-3" placeholder="Name" />
            <input className="rounded-xl border border-white/20 bg-white/5 px-4 py-3" placeholder="Email" />
            <textarea className="rounded-xl border border-white/20 bg-white/5 px-4 py-3" rows="4" placeholder="Message" />
            <Button type="button">Send Message</Button>
          </form>
          <div className="mt-6 flex gap-3">
            <a href="https://github.com/Sudarshan-Mane-2004" target="_blank" rel="noreferrer"><Link2 /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><BriefcaseBusiness /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Camera /></a>
            <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer"><MessageCircle /></a>
          </div>
        </Card>
      </section>

      <footer className="py-10 text-center text-sm text-slate-300">Designed & Built by Sudarshan Mane</footer>

      <div className="fixed bottom-5 right-5 z-50">
        {chatOpen ? (
          <Card className="w-[320px] p-0">
            <div className="flex items-center justify-between border-b border-white/10 p-3">
              <p className="font-medium">DevOps Assistant 🤖</p>
              <button onClick={() => setChatOpen(false)}><X size={16} /></button>
            </div>
            <div className="h-72 space-y-3 overflow-y-auto p-3 text-sm">
              {messages.map((message, idx) => (
                <div key={idx} className={`rounded-xl px-3 py-2 ${message.role === 'bot' ? 'bg-white/10' : 'bg-cyan-400/20'}`}>
                  {message.role === 'bot' ? <Bot size={14} className="mb-1" /> : <UserRound size={14} className="mb-1" />}
                  {message.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm" placeholder="Ask a question..." />
              <Button onClick={sendMessage} className="px-4 py-2 text-xs">Send</Button>
            </div>
          </Card>
        ) : (
          <button onClick={() => setChatOpen(true)} className="glass rounded-full p-4 text-cyan-300 shadow-glow"><Mail /></button>
        )}
      </div>
    </main>
  )
}
