import { Suspense, lazy, startTransition, useEffect, useState } from 'react'
import 'backtestcharts/styles.css'

const BacktestChartWidget = lazy(() => import('backtestcharts'))

const promptExamples = [
  {
    label: 'VWAP reversion',
    title: 'Trade intraday around Volume Weighted Average Price.',
    lines: [
      'Enter long when price dips slightly below VWAP and short when it moves slightly above.',
      'Use small deviations (0.2-0.5%) to trigger frequent trades instead of waiting for extremes.',
      'Exit quickly as price reverts back to VWAP and keep stops tight for a high-turnover, small-profit approach.',
    ],
  },
  {
    label: 'High-turnover scalping',
    title: 'Trade frequent mean reversion around a short-term average.',
    lines: [
      'Trade whenever price deviates slightly from a 5-10 period moving average, not just extreme moves.',
      'Enter both long and short using mild thresholds like RSI 45-55 crossings or small percentage deviations.',
      'Exit quickly at small profits and keep stops tight so the system favors many smaller trades.',
    ],
  },
  {
    label: '20 MA pullback',
    title: 'Buy deep pullbacks back toward the recent average.',
    lines: [
      'Buy when price drops significantly below a 20-period moving average and begins to stabilize.',
      'Use a momentum filter like RSI below 30 for entry and 50-60 for exit to avoid catching falling knives.',
      'Place a tight stop below recent lows so the downside stays controlled.',
    ],
  },
  {
    label: 'RSI reversion',
    title: 'RSI below 30. Exit above 60.',
    lines: [
      'Backtest 15m.',
      'Use RSI below 30 as the entry trigger and RSI above 60 as the exit trigger.',
      'Keep it as a simple mean-reversion setup with fast exits and tight risk.',
    ],
  },
]

const features = [
  {
    eyebrow: 'Markets',
    title: '500+ US stocks',
    detail: 'Move across liquid US names without leaving the chart surface.',
  },
  {
    eyebrow: 'Crypto',
    title: '1000+ crypto pairs',
    detail: 'Jump between major crypto pairs and keep the same workflow intact.',
  },
  {
    eyebrow: 'Studies',
    title: '200+ indicators',
    detail: 'Layer technical studies directly into the widget instead of splitting tools.',
  },
  {
    eyebrow: 'Drawing',
    title: '50+ drawing tools',
    detail: 'Mark levels, channels, notes, and patterns with a full drawing rail.',
  },
  {
    eyebrow: 'Replay',
    title: 'Live backtest',
    detail: 'Run, replay, and inspect strategy behavior directly on the chart.',
  },
  {
    eyebrow: 'AI',
    title: 'Backtest with prompt',
    detail: 'Describe the setup in plain language and move faster from idea to replay.',
  },
]

const widgetThemeTokens = {
  bg: '#ffffff',
  panel: '#ffffff',
  'panel-elev': '#fafafa',
  overlay: 'rgba(10, 10, 10, 0.05)',
  scrim: 'rgba(10, 10, 10, 0.24)',
  border: 'rgba(10, 10, 10, 0.14)',
  'border-strong': 'rgba(10, 10, 10, 0.92)',
  'border-subtle': 'rgba(10, 10, 10, 0.08)',
  text: '#0a0a0a',
  'text-muted': '#171717',
  'text-dim': '#525252',
  'text-faint': '#737373',
  accent: '#0a0a0a',
  'accent-fg': '#ffffff',
  'accent-soft': 'rgba(10, 10, 10, 0.08)',
  radius: '0px',
  shadow: 'none',
  'shadow-inner': 'none',
}

function readEnvString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function FeatureCard({ detail, eyebrow, title }) {
  return (
    <article className="feature-card group">
      <div className="feature-card-inner">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="feature-eyebrow">{eyebrow}</p>
            <h3 className="feature-title mt-3">{title}</h3>
          </div>
          <span className="feature-arrow" aria-hidden>
            +
          </span>
        </div>
        <p className="feature-detail">{detail}</p>
      </div>
    </article>
  )
}

function PromptShowcase() {
  const [activePromptIndex, setActivePromptIndex] = useState(0)
  const [copiedPromptIndex, setCopiedPromptIndex] = useState(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      startTransition(() => {
        setActivePromptIndex((prev) => (prev + 1) % promptExamples.length)
      })
    }, 5600)

    return () => {
      window.clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (copiedPromptIndex === null) {
      return undefined
    }

    const id = window.setTimeout(() => {
      setCopiedPromptIndex(null)
    }, 1800)

    return () => {
      window.clearTimeout(id)
    }
  }, [copiedPromptIndex])

  const activePrompt = promptExamples[activePromptIndex]

  async function handleCopyPrompt() {
    const promptText = [activePrompt.title, ...activePrompt.lines].join('\n')

    try {
      await navigator.clipboard.writeText(promptText)
      setCopiedPromptIndex(activePromptIndex)
    } catch {
      setCopiedPromptIndex(null)
    }
  }

  return (
    <div className="prompt-rotator" aria-live="polite">
      <div key={activePromptIndex} className="prompt-example">
        <div className="prompt-example-meta">
          <div className="prompt-example-meta-copy">
            <span className="prompt-example-index">{String(activePromptIndex + 1).padStart(2, '0')}</span>
            <span className="prompt-example-label">{activePrompt.label}</span>
          </div>
          <button type="button" onClick={handleCopyPrompt} className="prompt-copy-button">
            <svg
              className="prompt-copy-icon"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5.33325 3.33325V2.66659C5.33325 2.2984 5.63173 1.99992 5.99992 1.99992H13.3333C13.7014 1.99992 13.9999 2.2984 13.9999 2.66659V9.99992C13.9999 10.3681 13.7014 10.6666 13.3333 10.6666H12.6666"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <rect x="2" y="5.33325" width="8.66667" height="8.66667" stroke="currentColor" strokeWidth="1.25" />
            </svg>
            <span>{copiedPromptIndex === activePromptIndex ? 'Copied' : ''}</span>
          </button>
        </div>
        <p className="prompt-example-title">{activePrompt.title}</p>
        <div className="prompt-example-lines">
          <p className="prompt-example-intro">{activePrompt.lines[0]}</p>
          <div className="prompt-example-body">
            {activePrompt.lines.slice(1).map((line) => (
              <p key={line} className="prompt-example-text">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="prompt-pagers">
        {promptExamples.map((prompt, index) => (
          <button
            key={prompt.label}
            type="button"
            onClick={() =>
              startTransition(() => {
                setActivePromptIndex(index)
              })
            }
            className={`prompt-pager ${index === activePromptIndex ? 'is-active' : ''}`}
            aria-label={`Show ${prompt.label} prompt example`}
          >
            <span className="prompt-pager-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="prompt-pager-label">{prompt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const taapiSecret = readEnvString(import.meta.env.VITE_TAAPI_SECRET)
  const proxyEnabled = import.meta.env.VITE_TAAPI_PROXY === 'true'
  const taapiBaseConfigured = readEnvString(import.meta.env.VITE_TAAPI_BASE_URL)
  const taapiBaseUrl =
    taapiBaseConfigured || (proxyEnabled && import.meta.env.DEV ? 'http://localhost:4010' : undefined)
  const taapiProxy = proxyEnabled || (!taapiSecret && Boolean(taapiBaseConfigured))
  const hasDatasource = Boolean(taapiSecret) || Boolean(taapiProxy && taapiBaseUrl)

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-30 border-b border-black bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="brand-mark" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-[0.34em]">Croid</span>
          </a>
          <nav className="hidden items-center gap-6 sm:flex">
            <a href="#widget" className="header-link">
              Widget
            </a>
            <a href="#features" className="header-link">
              Features
            </a>
          </nav>
          <a
            href="#widget"
            className="inline-flex items-center justify-center border border-black bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            Open chart
          </a>
        </div>
      </header>

      <main id="top">
        <section className="overflow-hidden border-b border-black">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16">
              <div className="relative">
                <p className="label-kicker animate-rise">Croid</p>

                <h1 className="mt-5 animate-rise text-[clamp(4rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.08em] [animation-delay:120ms]">
                  <span className="block">CROID</span>
                  <span className="hero-emphasis mt-3 inline-flex">Charts on roids</span>
                </h1>

                <p className="mt-6 max-w-xl animate-rise text-base leading-7 text-neutral-700 [animation-delay:240ms] sm:text-lg">
                  Croid is a charting widget for stocks and crypto with indicators, drawing tools, live backtesting, and prompt-based strategy testing in one responsive surface.
                </p>

                <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:360ms] sm:flex-row">
                  <a className="button-primary" href="#widget">
                    Open chart
                  </a>
                  <a className="button-secondary" href="#features">
                    View features
                  </a>
                </div>
              </div>

              <div className="animate-rise [animation-delay:420ms]">
                <div className="prompt-stage">
                  <p className="label-kicker">Prompt workflow</p>
                  <div className="prompt-track">
                    <span className="prompt-track-dot" aria-hidden />
                    <p className="prompt-statement">
                      Test your strategies with <span className="prompt-highlight">just a prompt.</span>
                    </p>
                  </div>
                  <p className="prompt-caption">
                    Write the setup in plain language and let Croid turn it into a backtest workflow.
                  </p>
                  <PromptShowcase />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="widget" className="border-b border-black">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="label-kicker">Widget</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
                  Croid, live on the page.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-neutral-700">
                Search symbols, switch intervals, add indicators, draw, and run a backtest inside the same chart.
              </p>
            </div>

            <div className="overflow-hidden border border-black">
              <div className="flex flex-col gap-4 border-b border-black px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div />
              </div>

              {!hasDatasource ? (
                <div className="border-b border-black bg-black px-4 py-3 text-sm leading-6 text-white">
                  Add `VITE_TAAPI_SECRET`, or enable proxy mode with `VITE_TAAPI_PROXY=true`. In local development, proxy mode falls back to
                  `http://localhost:4010` when no base URL is set.
                </div>
              ) : null}

              <div className="h-[620px] sm:h-[700px] lg:h-[780px]">
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center border-t border-black bg-white px-6 text-center">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">Loading widget</p>
                        <p className="mt-3 max-w-md text-sm leading-7 text-neutral-700">
                          Pulling in the Croid charting surface so the rest of the page can render immediately.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <BacktestChartWidget
                    accent="#0a0a0a"
                    className="h-full"
                    defaultSymbol="BTCUSDT"
                    density="compact"
                    embedMode
                    interval="15m"
                    showBacktest
                    showDrawingRail
                    showHeader={false}
                    showSymbolSearch
                    style={{ height: '100%' }}
                    taapiBaseUrl={taapiBaseUrl}
                    taapiProxy={taapiProxy}
                    taapiSecret={taapiSecret}
                    theme="dark"
                    themeTokens={widgetThemeTokens}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-black">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="label-kicker">Features</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
                  Everything that powers the Croid workflow.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-neutral-700">
                Markets, studies, drawing, replay, and prompt-based strategy testing in one product surface.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <FeatureCard key={feature.title} detail={feature.detail} eyebrow={feature.eyebrow} title={feature.title} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-b border-black">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <a href="#top" className="flex items-center gap-3">
                <span className="brand-mark" aria-hidden />
                <span className="text-sm font-semibold uppercase tracking-[0.34em]">Croid</span>
              </a>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                Charting, drawing, indicators, live replay, and backtesting with prompt-based workflows in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#top" className="header-link">
                Top
              </a>
              <a href="#widget" className="header-link">
                Widget
              </a>
              <a href="#features" className="header-link">
                Features
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
