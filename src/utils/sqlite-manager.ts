import Database from "@tauri-apps/plugin-sql"

export interface TransactionDB {
    id: number
    type: "income" | "expense"
    amount: number
    description: string
    category: string
    date: string
    icon?: string
    color?: string
}

class SQLiteManager {
    private db: Database | null = null
    private initPromise: Promise<void> | null = null

    /**
     * Inicializa la base de datos y crea la tabla si no existe
     */
    async init(): Promise<void> {
        // Si ya está inicializándose, esperar esa promesa
        if (this.initPromise) {
            return this.initPromise
        }

        // Si ya está inicializado, no hacer nada
        if (this.db) {
            return
        }

        // Crear nueva promesa de inicialización
        this.initPromise = this._init()
        return this.initPromise
    }

    private async _init(): Promise<void> {
        try {
            // Cargar la base de datos SQLite
            this.db = await Database.load("sqlite:gastitos.db")

            // Crear tabla de transacciones
            await this.db.execute(`
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
                    amount REAL NOT NULL,
                    description TEXT NOT NULL,
                    category TEXT NOT NULL,
                    date TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `)

            console.log("Base de datos SQLite inicializada correctamente")
        } catch (error) {
            console.error("Error al inicializar SQLite:", error)
            this.db = null
            this.initPromise = null
            throw error
        }
    }

    /**
     * Asegura que la base de datos esté inicializada
     */
    private async ensureInit(): Promise<void> {
        if (!this.db) {
            await this.init()
        }
    }

    /**
     * Guarda una nueva transacción en la base de datos
     */
    async guardarTransaccion(data: Omit<TransactionDB, "id">): Promise<number> {
        await this.ensureInit()

        if (!this.db) {
            throw new Error("La base de datos no está disponible")
        }

        try {
            const resultado = await this.db.execute(
                `INSERT INTO transactions (type, amount, description, category, date) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [data.type, data.amount, data.description, data.category, data.date]
            )

            const nuevoId = resultado.lastInsertId
            if (nuevoId === undefined || nuevoId === null) {
                throw new Error("No se pudo obtener el ID de la transacción insertada")
            }

            return nuevoId
        } catch (error) {
            console.error("Error al guardar transacción:", error)
            throw error
        }
    }

    /**
     * Obtiene todas las transacciones de la base de datos
     */
    async obtenerTodasLasTransacciones(): Promise<TransactionDB[]> {
        await this.ensureInit()

        if (!this.db) {
            throw new Error("La base de datos no está disponible")
        }

        try {
            const resultados = await this.db.select<TransactionDB[]>(
                "SELECT * FROM transactions ORDER BY created_at DESC"
            )

            return resultados || []
        } catch (error) {
            console.error("Error al obtener transacciones:", error)
            return []
        }
    }

    /**
     * Elimina una transacción por su ID
     */
    async eliminarTransaccion(id: number): Promise<void> {
        await this.ensureInit()

        if (!this.db) {
            throw new Error("La base de datos no está disponible")
        }

        try {
            await this.db.execute("DELETE FROM transactions WHERE id = $1", [id])
        } catch (error) {
            console.error("Error al eliminar transacción:", error)
            throw error
        }
    }

    /**
     * Obtiene una transacción por su ID
     */
    async obtenerTransaccionPorId(id: number): Promise<TransactionDB | null> {
        await this.ensureInit()

        if (!this.db) {
            throw new Error("La base de datos no está disponible")
        }

        try {
            const resultados = await this.db.select<TransactionDB[]>(
                "SELECT * FROM transactions WHERE id = $1 LIMIT 1",
                [id]
            )

            return resultados && resultados.length > 0 ? resultados[0] : null
        } catch (error) {
            console.error("Error al obtener transacción por ID:", error)
            return null
        }
    }

    /**
     * Actualiza una transacción existente
     */
    async actualizarTransaccion(id: number, data: Omit<TransactionDB, "id">): Promise<void> {
        await this.ensureInit()

        if (!this.db) {
            throw new Error("La base de datos no está disponible")
        }

        try {
            await this.db.execute(
                `UPDATE transactions 
                 SET type = $1, amount = $2, description = $3, category = $4, date = $5 
                 WHERE id = $6`,
                [data.type, data.amount, data.description, data.category, data.date, id]
            )
        } catch (error) {
            console.error("Error al actualizar transacción:", error)
            throw error
        }
    }

    /**
     * Cierra la conexión a la base de datos
     */
    async cerrar(): Promise<void> {
        if (this.db) {
            try {
                await this.db.close()
            } catch (error) {
                console.error("Error al cerrar la base de datos:", error)
            }
            this.db = null
            this.initPromise = null
        }
    }
}

// Exportar instancia única
export const sqliteManager = new SQLiteManager()
