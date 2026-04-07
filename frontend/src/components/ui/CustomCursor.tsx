import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.body.classList.add('hide-cursor')

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf = 0

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    function loop() {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(loop)
    }

    function onMouseEnterLink() {
      dot.style.opacity = '0'
      ring.style.width = '48px'
      ring.style.height = '48px'
      ring.style.borderColor = 'var(--accent)'
      ring.style.marginLeft = '-24px'
      ring.style.marginTop = '-24px'
    }

    function onMouseLeaveLink() {
      dot.style.opacity = '1'
      ring.style.width = '32px'
      ring.style.height = '32px'
      ring.style.borderColor = 'rgba(200,255,0,0.4)'
      ring.style.marginLeft = '-16px'
      ring.style.marginTop = '-16px'
    }

    const interactives = document.querySelectorAll('a, button, [role="button"]')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink)
      el.addEventListener('mouseleave', onMouseLeaveLink)
    })

    window.addEventListener('mousemove', onMouseMove)
    raf = requestAnimationFrame(loop)

    return () => {
      document.body.classList.remove('hide-cursor')
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink)
        el.removeEventListener('mouseleave', onMouseLeaveLink)
      })
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
        style={{
          width: '6px',
          height: '6px',
          background: 'var(--accent)',
          borderRadius: '50%',
          marginLeft: '-3px',
          marginTop: '-3px',
          transition: 'opacity 0.2s',
          willChange: 'transform',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block"
        style={{
          width: '32px',
          height: '32px',
          border: '1px solid rgba(200,255,0,0.4)',
          borderRadius: '50%',
          marginLeft: '-16px',
          marginTop: '-16px',
          transition: 'width 0.2s, height 0.2s, border-color 0.2s, margin 0.2s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
