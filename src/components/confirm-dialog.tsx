import React from "react"
import { AlertTriangle, X, CheckCircle2 } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning"
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
}: ConfirmDialogProps) {
  // Efecto para manejar el foco y la accesibilidad cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden"

      // Manejar tecla Escape para cerrar
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      document.addEventListener("keydown", handleEscape)

      return () => {
        document.body.style.overflow = ""
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 backdrop-blur-lg bg-black bg-opacity-20" aria-hidden="true" />

      {/* Dialog */}
      <div
        className={`relative bg-gradient-to-br ${
          type === "danger"
            ? "from-red-50 to-pink-50 border-red-300"
            : "from-orange-50 to-yellow-50 border-orange-300"
        } border-4 rounded-3xl max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100`}
        style={{ borderRadius: "25px" }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 hover:bg-opacity-50 transition-colors z-10"
          type="button"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 rounded-full flex-shrink-0 ${
                type === "danger" ? "bg-red-200" : "bg-orange-200"
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${type === "danger" ? "text-red-600" : "text-orange-600"}`}
                aria-hidden="true"
              />
            </div>
            <h2
              id="confirm-dialog-title"
              className={`text-xl sm:text-2xl font-bold ${
                type === "danger" ? "text-red-800" : "text-orange-800"
              }`}
            >
              {title}
            </h2>
          </div>

          {/* Message */}
          <p
            id="confirm-dialog-description"
            className={`text-base ${
              type === "danger" ? "text-red-700" : "text-orange-700"
            } mb-6 px-2`}
          >
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 bg-gradient-to-r ${
                type === "danger"
                  ? "from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                  : "from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
              } text-white font-bold py-3 px-4 rounded-xl text-lg transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2`}
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

