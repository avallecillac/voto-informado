#!/usr/bin/env python3
"""
Add Spanish accents (tildes) to known unaccented words in data files.
Uses whole-word, case-aware replacement. Idempotent.

Scope: data/categories/*.json, data/questions/*.json, data/candidates/*.json,
       data/selected-questions.ts

Words to fix: curated list of unambiguous tildes common in our texts.
Words NOT in the list stay as-is (to avoid false positives).
"""
import json
import os
import re
from pathlib import Path

# (unaccented, accented) - only unambiguous transforms where either:
#   (a) the unaccented form is never the correct Spanish, OR
#   (b) the specific context in our texts always means the accented form.
WORD_MAP = [
    # -ción endings (always need tilde)
    ("economia", "economía"),
    ("economias", "economías"),
    ("Economia", "Economía"),
    ("tecnologia", "tecnología"),
    ("Tecnologia", "Tecnología"),
    ("tecnologica", "tecnológica"),
    ("tecnologicas", "tecnológicas"),
    ("tecnologico", "tecnológico"),
    ("tecnologicos", "tecnológicos"),
    ("ecologia", "ecología"),
    ("energia", "energía"),
    ("Energia", "Energía"),
    ("energias", "energías"),
    ("energetica", "energética"),
    ("energetico", "energético"),
    ("ideologia", "ideología"),
    ("ideologica", "ideológica"),
    ("ideologicas", "ideológicas"),
    ("ideologico", "ideológico"),
    ("ideologicos", "ideológicos"),
    ("cronologia", "cronología"),
    ("metodologia", "metodología"),
    ("Metodologia", "Metodología"),
    ("geografia", "geografía"),
    ("filosofia", "filosofía"),
    ("democracia", "democracia"),  # no change, but placeholder
    # Common -ción words
    ("educacion", "educación"),
    ("Educacion", "Educación"),
    ("informacion", "información"),
    ("Informacion", "Información"),
    ("polarizacion", "polarización"),
    ("Polarizacion", "Polarización"),
    ("nacion", "nación"),
    ("Nacion", "Nación"),
    ("nacional", "nacional"),  # no change
    ("poblacion", "población"),
    ("Poblacion", "Población"),
    ("poblaciones", "poblaciones"),  # no tilde
    ("administracion", "administración"),
    ("Administracion", "Administración"),
    ("produccion", "producción"),
    ("Produccion", "Producción"),
    ("construccion", "construcción"),
    ("Construccion", "Construcción"),
    ("institucion", "institución"),
    ("instituciones", "instituciones"),  # no tilde
    ("Institucion", "Institución"),
    ("justificacion", "justificación"),
    ("exploracion", "exploración"),
    ("explotacion", "explotación"),
    ("regulacion", "regulación"),
    ("Regulacion", "Regulación"),
    ("sustitucion", "sustitución"),
    ("restitucion", "restitución"),
    ("contratacion", "contratación"),
    ("corrupcion", "corrupción"),
    ("Corrupcion", "Corrupción"),
    ("anticorrupcion", "anticorrupción"),
    ("Anticorrupcion", "Anticorrupción"),
    ("proteccion", "protección"),
    ("Proteccion", "Protección"),
    ("solucion", "solución"),
    ("Solucion", "Solución"),
    ("soluciones", "soluciones"),  # no tilde
    ("revolucion", "revolución"),
    ("evolucion", "evolución"),
    ("constitucion", "constitución"),
    ("Constitucion", "Constitución"),
    ("constitucional", "constitucional"),  # no tilde
    ("distribucion", "distribución"),
    ("redistribucion", "redistribución"),
    ("intervencion", "intervención"),
    ("participacion", "participación"),
    ("Participacion", "Participación"),
    ("direccion", "dirección"),
    ("Direccion", "Dirección"),
    ("inversion", "inversión"),
    ("Inversion", "Inversión"),
    ("inversiones", "inversiones"),  # no tilde
    ("pension", "pensión"),
    ("Pension", "Pensión"),
    ("pensiones", "pensiones"),  # no tilde
    ("formacion", "formación"),
    ("Formacion", "Formación"),
    ("reformacion", "reformación"),
    ("transformacion", "transformación"),
    ("Transformacion", "Transformación"),
    ("aplicacion", "aplicación"),
    ("implementacion", "implementación"),
    ("Implementacion", "Implementación"),
    ("dedicacion", "dedicación"),
    ("atencion", "atención"),
    ("Atencion", "Atención"),
    ("atenciones", "atenciones"),  # no tilde
    ("gestion", "gestión"),
    ("Gestion", "Gestión"),
    ("gestiones", "gestiones"),  # no tilde
    ("accion", "acción"),
    ("Accion", "Acción"),
    ("acciones", "acciones"),  # no tilde
    ("reaccion", "reacción"),
    ("eleccion", "elección"),
    ("elecciones", "elecciones"),  # no tilde
    ("Elecciones", "Elecciones"),  # no tilde
    ("recoleccion", "recolección"),
    ("seleccion", "selección"),
    ("Seleccion", "Selección"),
    ("traduccion", "traducción"),
    ("introduccion", "introducción"),
    ("reduccion", "reducción"),
    ("Reduccion", "Reducción"),
    ("reducciones", "reducciones"),  # no tilde
    ("negociacion", "negociación"),
    ("cooperacion", "cooperación"),
    ("Cooperacion", "Cooperación"),
    ("asociacion", "asociación"),
    ("Asociacion", "Asociación"),
    ("organizacion", "organización"),
    ("Organizacion", "Organización"),
    ("urbanizacion", "urbanización"),
    ("privatizacion", "privatización"),
    ("Privatizacion", "Privatización"),
    ("privatizaciones", "privatizaciones"),  # no tilde
    ("descentralizacion", "descentralización"),
    ("Descentralizacion", "Descentralización"),
    ("centralizacion", "centralización"),
    ("legalizacion", "legalización"),
    ("realizacion", "realización"),
    ("criminalizacion", "criminalización"),
    ("globalizacion", "globalización"),
    ("Globalizacion", "Globalización"),
    ("mundializacion", "mundialización"),
    ("industrializacion", "industrialización"),
    ("reindustrializacion", "reindustrialización"),
    ("exportacion", "exportación"),
    ("exportaciones", "exportaciones"),  # no tilde
    ("Exportacion", "Exportación"),
    ("importacion", "importación"),
    ("importaciones", "importaciones"),  # no tilde
    ("Importacion", "Importación"),
    ("tributacion", "tributación"),
    ("financiacion", "financiación"),
    ("financiero", "financiero"),  # no change
    ("transicion", "transición"),
    ("Transicion", "Transición"),
    ("transiciones", "transiciones"),  # no tilde
    ("fumigacion", "fumigación"),
    ("erradicacion", "erradicación"),
    ("medicacion", "medicación"),
    ("medicamento", "medicamento"),  # no change
    ("decision", "decisión"),
    ("decisiones", "decisiones"),  # no tilde
    ("Decision", "Decisión"),
    ("discusion", "discusión"),
    ("inclusion", "inclusión"),
    ("exclusion", "exclusión"),
    ("presion", "presión"),
    ("presiones", "presiones"),  # no tilde
    ("expresion", "expresión"),
    ("depresion", "depresión"),
    ("expulsion", "expulsión"),
    ("suspension", "suspensión"),
    ("comision", "comisión"),
    ("comisiones", "comisiones"),  # no tilde
    ("extension", "extensión"),
    ("condicion", "condición"),
    ("condiciones", "condiciones"),  # no tilde
    ("Condiciones", "Condiciones"),  # no tilde
    ("sancion", "sanción"),
    ("sanciones", "sanciones"),  # no tilde
    ("inflacion", "inflación"),
    ("Inflacion", "Inflación"),
    ("poblacional", "poblacional"),  # no tilde
    ("racional", "racional"),  # no tilde
    ("irracional", "irracional"),  # no tilde
    # -ía / -ío endings
    ("politica", "política"),
    ("Politica", "Política"),
    ("politicas", "políticas"),
    ("Politicas", "Políticas"),
    ("politico", "político"),
    ("Politico", "Político"),
    ("politicos", "políticos"),
    ("Politicos", "Políticos"),
    ("publica", "pública"),
    ("Publica", "Pública"),
    ("publicas", "públicas"),
    ("Publicas", "Públicas"),
    ("publico", "público"),
    ("Publico", "Público"),
    ("publicos", "públicos"),
    ("Publicos", "Públicos"),
    ("practica", "práctica"),
    ("practicas", "prácticas"),
    ("practico", "práctico"),
    ("practicos", "prácticos"),
    ("democratica", "democrática"),
    ("democraticas", "democráticas"),
    ("democratico", "democrático"),
    ("democraticos", "democráticos"),
    ("Democratica", "Democrática"),
    ("Democratico", "Democrático"),
    ("estrategica", "estratégica"),
    ("estrategicas", "estratégicas"),
    ("estrategico", "estratégico"),
    ("estrategicos", "estratégicos"),
    ("historica", "histórica"),
    ("historicas", "históricas"),
    ("historico", "histórico"),
    ("Historico", "Histórico"),
    ("Historicos", "Históricos"),
    ("historicos", "históricos"),
    ("cientifica", "científica"),
    ("cientifico", "científico"),
    ("cientificas", "científicas"),
    ("cientificos", "científicos"),
    ("academico", "académico"),
    ("academica", "académica"),
    ("academicos", "académicos"),
    ("academicas", "académicas"),
    ("organico", "orgánico"),
    ("organica", "orgánica"),
    ("basico", "básico"),
    ("basica", "básica"),
    ("basicos", "básicos"),
    ("basicas", "básicas"),
    ("fisica", "física"),
    ("fisicas", "físicas"),
    ("fisico", "físico"),
    ("fisicos", "físicos"),
    ("especifico", "específico"),
    ("especifica", "específica"),
    ("especificas", "específicas"),
    ("especificos", "específicos"),
    ("unico", "único"),
    ("unica", "única"),
    ("unicos", "únicos"),
    ("unicas", "únicas"),
    ("maximo", "máximo"),
    ("maxima", "máxima"),
    ("maximos", "máximos"),
    ("maximas", "máximas"),
    ("minimo", "mínimo"),
    ("minima", "mínima"),
    ("minimos", "mínimos"),
    ("minimas", "mínimas"),
    ("ultimo", "último"),
    ("ultima", "última"),
    ("ultimos", "últimos"),
    ("ultimas", "últimas"),
    ("proximo", "próximo"),
    ("proxima", "próxima"),
    ("proximos", "próximos"),
    ("ideal", "ideal"),  # no change
    ("ideales", "ideales"),  # no change
    ("tipico", "típico"),
    ("tipica", "típica"),
    ("cronico", "crónico"),
    ("cronica", "crónica"),
    ("cronicos", "crónicos"),
    ("publicacion", "publicación"),
    ("fabrica", "fábrica"),
    ("fabricas", "fábricas"),
    ("cafe", "café"),
    ("cafes", "cafés"),
    ("pais", "país"),
    ("paises", "países"),
    ("Pais", "País"),
    ("aun", "aún"),  # when meaning "yet/still" - common enough
    ("Aun", "Aún"),
    ("despues", "después"),
    ("Despues", "Después"),
    ("facil", "fácil"),
    ("faciles", "fáciles"),
    ("dificil", "difícil"),
    ("dificiles", "difíciles"),
    ("util", "útil"),
    ("utiles", "útiles"),
    ("debil", "débil"),
    ("debiles", "débiles"),
    ("movil", "móvil"),
    ("moviles", "móviles"),
    ("automovil", "automóvil"),
    ("civil", "civil"),  # no change (civil has no tilde)
    ("dia", "día"),
    ("dias", "días"),
    ("geografico", "geográfico"),
    ("geografica", "geográfica"),
    ("demografico", "demográfico"),
    ("demografica", "demográfica"),
    ("crecimiento", "crecimiento"),  # no change
    # Specific accented words
    ("asi", "así"),
    ("Asi", "Así"),
    ("tambien", "también"),
    ("Tambien", "También"),
    ("mas", "más"),  # tricky - "mas" (but) is valid but rare. Accept this risk
    ("Mas", "Más"),
    ("facilmente", "fácilmente"),
    ("rapidamente", "rápidamente"),
    ("publicamente", "públicamente"),
    ("politicamente", "políticamente"),
    ("historicamente", "históricamente"),
    ("probablemente", "probablemente"),  # no tilde
    ("ningun", "ningún"),
    ("Ningun", "Ningún"),
    ("algun", "algún"),
    ("Algun", "Algún"),
    ("segun", "según"),
    ("Segun", "Según"),
    ("oceano", "océano"),
    ("oceanos", "océanos"),
    ("rapido", "rápido"),
    ("rapidos", "rápidos"),
    ("rapida", "rápida"),
    ("rapidas", "rápidas"),
    ("exitos", "éxitos"),
    ("exito", "éxito"),
    ("area", "área"),
    ("areas", "áreas"),
    ("Area", "Área"),
    ("agil", "ágil"),
    ("agiles", "ágiles"),
    ("indice", "índice"),
    ("indices", "índices"),
    ("objetivo", "objetivo"),  # no change
    ("numero", "número"),
    ("numeros", "números"),
    ("oceanografica", "oceanográfica"),
    ("burocratica", "burocrática"),
    ("burocraticas", "burocráticas"),
    ("burocratico", "burocrático"),
    # Verbs with tilde
    ("esta", "está"),  # tricky - "esta" demonstrative pronoun vs "está" verb
                       # Risk: "esta casa" → "está casa" (wrong). Skip this.
    ("estan", "están"),
    ("Estan", "Están"),
    ("proposito", "propósito"),
    ("Proposito", "Propósito"),
    ("propositos", "propósitos"),
    # Proper nouns
    ("Ivan", "Iván"),
    ("Lopez", "López"),
    ("Jose", "José"),
    ("Gonzalez", "González"),
    ("Rodriguez", "Rodríguez"),
    ("Martinez", "Martínez"),
    ("Perez", "Pérez"),
    ("Ramirez", "Ramírez"),
    ("Sanchez", "Sánchez"),
    ("Gomez", "Gómez"),
    ("Hernandez", "Hernández"),
    ("Fernandez", "Fernández"),
    ("Medellin", "Medellín"),
    ("Bogota", "Bogotá"),
    ("Espana", "España"),
    ("Peru", "Perú"),
    ("Mexico", "México"),
    # sentinel removed
    # Other common
    ("transito", "tránsito"),
    ("transmision", "transmisión"),
    ("proposicion", "proposición"),
    ("propuesta", "propuesta"),  # no change
    ("espiritu", "espíritu"),
    ("expirita", "expirita"),  # no change
    ("diagnostico", "diagnóstico"),
    ("pronostico", "pronóstico"),
    ("estadistica", "estadística"),
    ("estadisticas", "estadísticas"),
    ("automatica", "automática"),
    ("automaticas", "automáticas"),
    ("automatico", "automático"),
    ("automaticos", "automáticos"),
    ("matematica", "matemática"),
    ("matematicas", "matemáticas"),
    ("matematico", "matemático"),
    ("matematicos", "matemáticos"),
    ("informatica", "informática"),
    ("informaticas", "informáticas"),
    ("informatico", "informático"),
    ("informaticos", "informáticos"),
    ("sistematica", "sistemática"),
    ("sistematico", "sistemático"),
    ("problematica", "problemática"),
    ("problematicas", "problemáticas"),
    ("problematico", "problemático"),
    ("problematicos", "problemáticos"),
    ("logica", "lógica"),
    ("logicas", "lógicas"),
    ("logico", "lógico"),
    ("logicos", "lógicos"),
    # Colombian specific
    ("Registraduria", "Registraduría"),
    ("Colombia", "Colombia"),  # no change
    ("rio", "río"),  # tricky; valid noun
    ("Rio", "Río"),
    ("garantias", "garantías"),
    ("garantia", "garantía"),
    ("economicas", "económicas"),
    ("economicos", "económicos"),
    ("economica", "económica"),
    ("economico", "económico"),
    ("categorias", "categorías"),
    ("categoria", "categoría"),
    ("democracias", "democracias"),  # no tilde
    ("democracia", "democracia"),  # no tilde
    ("soberania", "soberanía"),
    ("monarquia", "monarquía"),
    ("maquinaria", "maquinaria"),  # no change
    ("industrias", "industrias"),  # no change
    ("industria", "industria"),  # no change
    ("telefono", "teléfono"),
    ("telefonos", "teléfonos"),
    # More common words
    ("peligroso", "peligroso"),  # no change
    ("sensibilidad", "sensibilidad"),  # no change
    ("proteccionista", "proteccionista"),  # no change
    ("internacional", "internacional"),  # no change
    ("internacionales", "internacionales"),  # no change
    ("provisional", "provisional"),  # no change
    ("opcion", "opción"),
    ("opciones", "opciones"),  # no tilde
    ("diferenciacion", "diferenciación"),
    ("diferenciaciones", "diferenciaciones"),  # no tilde
    ("diferencia", "diferencia"),  # no change
    ("diferencias", "diferencias"),  # no change
    ("cuando", "cuando"),  # no tilde when not interrogative
    ("donde", "donde"),
    ("como", "como"),  # no tilde when not interrogative; careful
    ("cual", "cuál"),  # usually interrogative in our app, but risky
                        # Skip to avoid false positives. Handled manually.
    ("algun", "algún"),
    ("volveran", "volverán"),
    ("estaran", "estarán"),
    ("iran", "irán"),
    ("seran", "serán"),
    ("habran", "habrán"),
    ("llegaran", "llegarán"),
    ("tendran", "tendrán"),
    ("podran", "podrán"),
    ("daran", "darán"),
    ("haran", "harán"),
    # Common Colombian words
    ("energetico", "energético"),
    ("energetica", "energética"),
    ("energeticos", "energéticos"),
    ("energeticas", "energéticas"),
]

# Remove sentinels and no-change entries (src == dst)
clean = [(s, d) for s, d in WORD_MAP if len(str(s)) >= 2 and s != d and isinstance(d, str)]

# Very risky ones we SKIP to avoid false positives:
SKIP = {
    "esta", "Esta",  # "esta casa" vs "está aquí"
    "mas", "Mas",    # "mas" (but) vs "más" (more)
    "cual",          # "el cual" vs "¿cuál?"
    "como", "Como",  # same
    "cuando", "Cuando",
    "donde", "Donde",
    "aun", "Aun",    # "aun cuando" vs "aún"
    "rio", "Rio",    # "río" is always with tilde, but "Río de Janeiro" etc
}

clean = [(s, d) for s, d in clean if s not in SKIP]

# Compile regex patterns (\b word boundaries for whole word match)
patterns = [(re.compile(r"\b" + re.escape(s) + r"\b"), d) for s, d in clean]


def transform(text: str) -> str:
    for pat, dst in patterns:
        text = pat.sub(dst, text)
    return text


def process_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    updated = transform(original)
    if original != updated:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main():
    targets = []
    data_dir = Path("data")
    for sub in ["categories", "questions", "candidates"]:
        targets.extend(sorted((data_dir / sub).glob("*.json")))
    targets.append(data_dir / "selected-questions.ts")

    changed = []
    for t in targets:
        if t.exists():
            if process_file(t):
                changed.append(str(t))

    print(f"Modified {len(changed)} files:")
    for c in changed:
        print(f"  {c}")


if __name__ == "__main__":
    main()
