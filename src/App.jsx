import { Suspense, lazy } from 'react'
import 'backtestcharts/styles.css'

const BacktestChartWidget = lazy(() => import('backtestcharts'))

const metrics = [
  {
    value: '500+',
    label: 'US stocks',
    detail: 'Load names like AAPL, NVDA, MSFT, and more without leaving the page.',
  },
  {
    value: '1000+',
    label: 'Crypto pairs',
    detail: 'Jump across major crypto pairs fast and keep the chart interaction smooth.',
  },
  {
    value: '200+',
    label: 'Indicators',
    detail: 'Layer technical studies directly into the chart workflow instead of splitting tools.',
  },
  {
    value: '50+',
    label: 'Drawing tools',
    detail: 'Mark levels, channels, annotations, and patterns with a full drawing rail.',
  },
  {
    value: 'Live',
    label: 'Backtest',
    detail: 'Replay entries, inspect outcomes, and test ideas inside the same widget.',
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

function CapabilityItem({ detail, label, value }) {
  return (
    <article className="border-t border-black/15 py-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-lg font-semibold tracking-[-0.06em] text-black">{value}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">{label}</span>
      </div>
      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">{detail}</p>
    </article>
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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#top" className="text-sm font-semibold uppercase tracking-[0.3em]">
            backtestCharts
          </a>
          <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600 sm:flex" />
        </div>
      </header>

      <main id="top">
        <section className="overflow-hidden border-b border-black">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16">
              <div className="relative">
                <p className="label-kicker animate-rise">backtestCharts</p>

                <h1 className="mt-5 animate-rise text-[clamp(4rem,10vw,8rem)] font-semibold leading-[0.9] tracking-[-0.08em] [animation-delay:120ms]">
                  <span className="block">CHARTS ON</span>
                  <span className="hero-emphasis mt-3 inline-flex">ROIDS</span>
                </h1>

                <p className="mt-6 max-w-xl animate-rise text-base leading-7 text-neutral-700 [animation-delay:240ms] sm:text-lg">
                  A charting widget for stocks and crypto with indicators, drawing tools, and live backtesting in one responsive surface.
                </p>

                <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:360ms] sm:flex-row">
                  <a className="button-primary" href="#widget">
                    Open chart
                  </a>
                </div>
              </div>

              <div id="capabilities" className="animate-rise [animation-delay:420ms]">
                <div className="lg:border-l lg:border-black/15 lg:pl-8">
                  <p className="label-kicker">Capabilities</p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Coverage, tooling, and backtesting in a single chart workflow.
                  </p>

                  <div className="mt-5 border-b border-black/15">
                    {metrics.map((metric) => (
                      <CapabilityItem
                        key={metric.label}
                        detail={metric.detail}
                        label={metric.label}
                        value={metric.value}
                      />
                    ))}
                  </div>
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
                  The full chart, on the page.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-neutral-700">
                Type any letter to search for a symbol, switch intervals, add indicators, draw, and run a backtest.
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
                          Pulling in the live charting surface so the rest of the page can render immediately.
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
        <footer className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]">backtestCharts</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row" />
          </div>
        </footer>
      </main>
    </div>
  )
}
