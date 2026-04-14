import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { loadSlim } from '@tsparticles/slim'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

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

const staticProjects = [
  {
    title: 'CI/CD Pipeline',
    description: 'Enterprise-grade CI/CD pipeline with AWS, Docker, Jenkins and security checks using Trivy.',
    tech: ['AWS', 'Docker', 'Jenkins', 'DevSecOps', 'Trivy'],
  },
  {
    title: 'Kubernetes GitOps',
    description: 'Production-style GitOps delivery model powered by ArgoCD and declarative manifests.',
    tech: ['Kubernetes', 'ArgoCD', 'GitOps', 'Helm'],
  },
  {
    title: 'Terraform Multi-Cloud',
    description: 'Multi-cloud Infrastructure as Code setup across AWS and GCP using reusable Terraform modules.',
    tech: ['Terraform', 'AWS', 'GCP', 'IaC'],
  },
  {
    title: 'Microservices Deployment',
    description: 'Containerized microservices with observability, autoscaling, and rollout strategies.',
    tech: ['Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
  },
]

const educationEntries = [
  {
    level: 'Bachelor of Computer Science (BCS)',
    result: 'CGPA: 9.19',
    institution: 'COCSIT, Latur',
    period: '2023 - 2025',
  },
  {
    level: 'HSC (12th)',
    result: 'Higher Secondary',
    institution: 'MBM, Latur',
    period: '2022',
  },
  {
    level: 'SSC (10th)',
    result: 'Secondary School',
    institution: 'YV, Ahmedpur',
    period: '2020',
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
    { role: 'bot', text: "Hi, I'm DevOps Assistant 🤖. Ask about Sudarshan's skills, projects, dashboard, or contact." },
  ])
  const [botTyping, setBotTyping] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [metricsHistory, setMetricsHistory] = useState([])
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    '$ help',
    'Commands: help, about, skills, projects, contact, clear',
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

  useEffect(() => {
    let mounted = true
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/metrics`)
        const data = await response.json()
        if (!mounted) return
        setMetrics(data)
        setMetricsHistory((prev) => [...prev.slice(-11), data])
      } catch {
        if (!mounted) return
        setMetrics((prev) => prev ?? { cpu: 62, memory: 58, network: 280, containers: 12, status: 'Healthy' })
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 7000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
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

  const sendMessage = async () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: input }])
    const prompt = input
    setInput('')
    setBotTyping(true)
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply || 'I can help with skills, projects and DevOps.' }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Chat API is currently unavailable. Please deploy backend and set OPENAI_API_KEY for full AI responses.',
        },
      ])
    } finally {
      setBotTyping(false)
    }
  }

  const runTerminalCommand = (rawInput) => {
    const command = rawInput.toLowerCase().trim()
    let response = ''
    switch (command) {
      case 'help':
        response = 'Commands: help | about | skills | projects | contact | clear'
        break
      case 'about':
        response = 'Sudarshan Sidram Mane - AWS & DevOps Engineer focused on cloud automation and reliable delivery.'
        break
      case 'skills':
        response = 'AWS, GCP(familiar), Azure(basics), Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, ArgoCD, Prometheus, Grafana, Python, Bash, Linux, Networking, Prompt Engineering, Generative AI.'
        break
      case 'projects':
        response = 'CI/CD Pipeline | Kubernetes GitOps | Terraform Multi-Cloud | Microservices Deployment'
        break
      case 'contact':
        response = 'Phone: +91-9579979563 | Email: manesudarshan3096@gmail.com'
        break
      case 'clear':
        setTerminalOutput([])
        return
      default:
        response = `Command not found: ${command}. Type "help".`
    }
    setTerminalOutput((prev) => [...prev, `$ ${rawInput}`, response])
  }

  const chartData = metricsHistory.map((item, index) => ({
    index: index + 1,
    cpu: item.cpu,
    memory: item.memory,
    network: item.network,
    containers: item.containers,
  }))

  return (
    <main className="relative overflow-hidden bg-hero-gradient text-white">
      <motion.div className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-cyan-300" style={{ scaleX: progress }} />
      {particlesReady && <Particles className="fixed inset-0 -z-10" options={particleOptions} />}
      {loading && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
          <motion.div animate={{ scale: [0.9, 1.08, 1], opacity: [0.45, 1, 0.95] }} transition={{ repeat: Infinity, duration: 2 }} className="text-2xl font-semibold tracking-tight">
            Sudarshan Sidram Mane
          </motion.div>
        </motion.div>
      )}

      <nav className="glass fixed left-1/2 top-4 z-40 flex w-[92%] max-w-6xl -translate-x-1/2 items-center justify-between rounded-full px-5 py-3">
        <span className="text-sm font-medium">Sudarshan Sidram Mane</span>
        <div className="hidden gap-5 text-sm text-slate-200 md:flex">
          {['about', 'experience', 'skills', 'projects', 'dashboard', 'terminal', 'education', 'contact'].map((id) => (
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
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Hi, I&apos;m Sudarshan Sidram Mane</h1>
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
            <p className="mt-4 text-slate-300">
              AWS & DevOps Engineer with hands-on experience across CI/CD automation, AWS infrastructure, Kubernetes orchestration,
              DevSecOps scanning, and observability-first operations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center"><p className="text-4xl font-semibold text-cyan-300">24+</p><p className="text-sm text-slate-300">Projects Completed</p></Card>
            <Card className="text-center"><p className="text-4xl font-semibold text-cyan-300">50+</p><p className="text-sm text-slate-300">Technologies Learned</p></Card>
          </div>
        </Card>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Experience</h2>
        <div className="mt-8 border-l border-cyan-300/40 pl-6">
          <Card>
            <p className="text-cyan-300">Cravita Technology India Private Limited</p>
            <h3 className="mt-1 text-xl">AWS & DevOps Intern</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>- CI/CD pipelines with Jenkins and GitHub Actions</li>
              <li>- AWS deployments with EC2, ECR and EKS</li>
              <li>- Docker and Kubernetes workloads for scalable delivery</li>
              <li>- DevSecOps integration using Trivy</li>
              <li>- Monitoring implementation with Prometheus and Grafana</li>
            </ul>
          </Card>
        </div>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Skills</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            'AWS, GCP (Familiar), Azure (Basics)',
            'Docker, Kubernetes',
            'Terraform',
            'Jenkins, GitHub Actions',
            'ArgoCD (GitOps)',
            'Prometheus, Grafana',
            'Python, Bash',
            'Linux, Networking',
            'Prompt Engineering',
            'Generative AI',
          ].map((skill) => (
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

      <section id="dashboard" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">DevOps Dashboard</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            ['CPU Usage', `${metrics?.cpu ?? '--'}%`],
            ['Memory Usage', `${metrics?.memory ?? '--'}%`],
            ['Network Traffic', `${metrics?.network ?? '--'} Mbps`],
            ['Active Containers', `${metrics?.containers ?? '--'}`],
            ['Deployment Status', metrics?.status ?? 'Fetching...'],
          ].map(([label, value]) => (
            <Card key={label} className="border-emerald-400/20 bg-slate-950/70">
              <p className="text-xs uppercase tracking-widest text-emerald-300">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-cyan-200">{value}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="bg-slate-950/80">
            <p className="mb-4 text-sm text-emerald-300">CPU vs Memory</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1e293b" />
                  <XAxis dataKey="index" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="memory" stroke="#34d399" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="bg-slate-950/80">
            <p className="mb-4 text-sm text-emerald-300">Network & Containers</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#1e293b" />
                  <XAxis dataKey="index" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="network" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="containers" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <Card className="mt-4 bg-slate-950/80">
          <p className="mb-4 text-sm text-emerald-300">Service Stability (Area)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke="#1e293b" />
                <XAxis dataKey="index" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#06b6d4" fill="#0e7490" />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#10b981" fill="#047857" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <section id="terminal" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Terminal Mode</h2>
        <Card className="mt-6 border-emerald-400/30 bg-black/80 p-0">
          <div className="max-h-72 overflow-auto p-5 font-mono text-sm text-emerald-300">
            {terminalOutput.map((line, index) => (
              <p key={`${line}-${index}`} className="mb-2">{line}</p>
            ))}
            <form
              onSubmit={(event) => {
                event.preventDefault()
                runTerminalCommand(terminalInput)
                setTerminalInput('')
              }}
              className="mt-4 flex items-center gap-2"
            >
              <span>$</span>
              <input
                value={terminalInput}
                onChange={(event) => setTerminalInput(event.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Type command..."
              />
            </form>
          </div>
        </Card>
      </section>

      <section id="education" className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="section-title">Education</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {educationEntries.map((edu) => (
            <Card key={edu.level} className="flex flex-col gap-2 transition hover:border-cyan-300/50">
              <p className="text-sm font-medium text-cyan-300">{edu.level}</p>
              <p className="text-lg font-semibold tracking-tight">{edu.result}</p>
              <p className="text-slate-300">{edu.institution}</p>
              <p className="mt-auto pt-2 text-sm text-slate-400">{edu.period}</p>
            </Card>
          ))}
        </div>
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
          <div className="mt-5 space-y-1 text-sm text-slate-300">
            <p>Phone: +91-9579979563</p>
            <p>Email: manesudarshan3096@gmail.com</p>
            <p>Domain: sudarshaanxoffficial.com</p>
          </div>
          <div className="mt-6 flex gap-3">
            <a href="https://github.com/Sudarshan-Mane-2004" target="_blank" rel="noreferrer"><Link2 /></a>
            <a href="https://www.linkedin.com/in/sudarshan-mane-504a59294" target="_blank" rel="noreferrer"><BriefcaseBusiness /></a>
            <a href="https://instagram.com/sudarshaanxofficial" target="_blank" rel="noreferrer"><Camera /></a>
            <a href="https://wa.me/919579979563" target="_blank" rel="noreferrer"><MessageCircle /></a>
          </div>
        </Card>
      </section>

      <footer className="py-10 text-center text-sm text-slate-300">Designed & Built by Sudarshan Sidram Mane</footer>

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
              {botTyping && <p className="text-xs text-slate-400">Assistant is typing...</p>}
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
