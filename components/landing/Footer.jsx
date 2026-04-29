'use client'

import { MessageCircle, Settings } from 'lucide-react'

function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TiktokIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  )
}
import { negocio as defaultNegocio, navLinks } from '@/lib/config'

export default function Footer({ negocio = defaultNegocio }) {
  return (
    <footer id="contacto" className="bg-primary text-white">
      <div className="px-6 md:px-12 py-12 md:py-16">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display font-light text-2xl uppercase tracking-logo">
            {negocio.nombre}
          </span>
          <span className="block font-display font-light text-[9px] uppercase tracking-[0.3em] text-white/50 mt-1">
            {negocio.subtitulo}
          </span>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center md:text-left">
          {/* Navigation */}
          <div>
            <h4 className="font-display text-[11px] uppercase tracking-editorial text-white/50 mb-4">
              NAVEGACION
            </h4>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block font-display text-[11px] uppercase tracking-editorial text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-[11px] uppercase tracking-editorial text-white/50 mb-4">
              CONTACTO
            </h4>
            <div className="space-y-2 font-body text-sm text-white/70">
              {negocio.direccion && <p>{negocio.direccion}</p>}
              <p>{negocio.ciudad}, {negocio.provincia}</p>
              {negocio.horario && <p>{negocio.horario}</p>}
              {negocio.email && <p>{negocio.email}</p>}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-[11px] uppercase tracking-editorial text-white/50 mb-4">
              SEGUINOS
            </h4>
            <div className="flex justify-center md:justify-start gap-4">
              {negocio.instagram && (
                <a
                  href={`https://instagram.com/${negocio.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              )}
              {negocio.facebook && (
                <a
                  href={negocio.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon size={20} />
                </a>
              )}
              {negocio.tiktok && (
                <a
                  href={`https://www.tiktok.com/@${negocio.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <TiktokIcon size={20} />
                </a>
              )}
              {negocio.whatsapp && (
                <a
                  href={`https://wa.me/${negocio.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={20} strokeWidth={1.5} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border-dark px-6 md:px-12 py-4">
        <p className="text-center font-body font-light text-[11px] text-white/50 inline-flex items-center justify-center gap-2 w-full">
          &copy; {new Date().getFullYear()} {negocio.nombre} {negocio.subtitulo}. Todos los derechos reservados.
          <a
            href="/admin"
            aria-label="Panel de administracion"
            title="Admin"
            className="inline-flex items-center justify-center w-5 h-5 text-white/20 hover:text-white/80 hover:rotate-90 transition-all duration-500"
          >
            <Settings size={12} strokeWidth={1.5} />
          </a>
        </p>
      </div>
    </footer>
  )
}
