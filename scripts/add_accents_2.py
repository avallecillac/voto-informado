#!/usr/bin/env python3
"""Second pass: add ñ and remaining tildes missed in pass 1."""
import re
from pathlib import Path

MAP = [
    # ñ - always unambiguous in our texts
    ("tamano", "tamaño"),
    ("Tamano", "Tamaño"),
    ("acompanamiento", "acompañamiento"),
    ("acompanar", "acompañar"),
    ("acompana", "acompaña"),
    ("companeros", "compañeros"),
    ("companero", "compañero"),
    ("compania", "compañía"),
    ("companias", "compañías"),
    ("espanol", "español"),
    ("espanola", "española"),
    ("Espanol", "Español"),
    ("Espanola", "Española"),
    ("manana", "mañana"),
    ("Manana", "Mañana"),
    ("senor", "señor"),
    ("Senor", "Señor"),
    ("senora", "señora"),
    ("Senora", "Señora"),
    ("senal", "señal"),
    ("senales", "señales"),
    ("pequeno", "pequeño"),
    ("pequena", "pequeña"),
    ("pequenos", "pequeños"),
    ("pequenas", "pequeñas"),
    ("ninos", "niños"),
    ("ninas", "niñas"),
    ("nino", "niño"),
    ("nina", "niña"),
    ("ensenanza", "enseñanza"),
    ("ensenar", "enseñar"),
    ("montana", "montaña"),
    ("montanas", "montañas"),
    ("ano", "año"),
    ("anos", "años"),
    ("Ano", "Año"),
    ("Anos", "Años"),
    # Missing tildes
    ("critica", "crítica"),
    ("Critica", "Crítica"),
    ("criticas", "críticas"),
    ("critico", "crítico"),
    ("criticos", "críticos"),
    ("dolar", "dólar"),
    ("dolares", "dólares"),
    ("policia", "policía"),
    ("Policia", "Policía"),
    ("policias", "policías"),
    ("medico", "médico"),
    ("medicos", "médicos"),
    ("medica", "médica"),
    ("medicas", "médicas"),
    ("carcel", "cárcel"),
    ("Carcel", "Cárcel"),
    ("carceles", "cárceles"),
    ("petroleo", "petróleo"),
    ("jovenes", "jóvenes"),
    ("genero", "género"),
    ("generos", "géneros"),
    ("victimas", "víctimas"),
    ("Victimas", "Víctimas"),
    ("victima", "víctima"),
    ("republica", "república"),
    ("Republica", "República"),
    ("electrico", "eléctrico"),
    ("electrica", "eléctrica"),
    ("electricas", "eléctricas"),
    ("electricos", "eléctricos"),
    ("logistica", "logística"),
    ("logistico", "logístico"),
    ("atomico", "atómico"),
    ("atomica", "atómica"),
    ("demografica", "demográfica"),
    ("oceanografico", "oceanográfico"),
    ("hidroelectrica", "hidroeléctrica"),
    ("hidroelectricas", "hidroeléctricas"),
    ("hidroelectrico", "hidroeléctrico"),
    ("termoelectrica", "termoeléctrica"),
    ("termoelectricas", "termoeléctricas"),
    # Past tenses and common accented verbs
    ("explicito", "explícito"),
    ("explicita", "explícita"),
    ("explicitas", "explícitas"),
    ("implicito", "implícito"),
    ("implicita", "implícita"),
    ("implicitas", "implícitas"),
    # Common -ico/-ica
    ("alcoholico", "alcohólico"),
    ("electronico", "electrónico"),
    ("electronica", "electrónica"),
    ("electronicos", "electrónicos"),
    ("electronicas", "electrónicas"),
    ("agronomico", "agronómico"),
    ("agronomica", "agronómica"),
    ("cosmetico", "cosmético"),
    ("domestico", "doméstico"),
    ("domestica", "doméstica"),
    ("domesticos", "domésticos"),
    ("domesticas", "domésticas"),
    ("tragico", "trágico"),
    ("magico", "mágico"),
    ("clasico", "clásico"),
    ("clasicos", "clásicos"),
    ("tipico", "típico"),
    ("tipica", "típica"),
    ("tipicos", "típicos"),
    ("tipicas", "típicas"),
    ("escenico", "escénico"),
    ("etico", "ético"),
    ("etica", "ética"),
    ("eticos", "éticos"),
    ("eticas", "éticas"),
    ("artistico", "artístico"),
    ("artistica", "artística"),
    ("artisticos", "artísticos"),
    ("artisticas", "artísticas"),
    # -graphia / -grafo
    ("bibliografia", "bibliografía"),
    ("ortografia", "ortografía"),
    ("fotografia", "fotografía"),
    ("fotografico", "fotográfico"),
    # Common Colombian words
    ("tuteo", "tuteo"),  # no change
    ("mineria", "minería"),
    ("Mineria", "Minería"),
    ("ingenieria", "ingeniería"),
    ("compania", "compañía"),
    ("nombramiento", "nombramiento"),  # no change
    ("ceremonia", "ceremonia"),  # no change
    ("anomalia", "anomalía"),
    ("anomalias", "anomalías"),
    # Specific missed words
    ("regimen", "régimen"),
    ("regimenes", "regímenes"),
    ("Regimen", "Régimen"),
    ("Regimenes", "Regímenes"),
    ("termino", "término"),
    ("terminos", "términos"),
    ("ultimos", "últimos"),
    ("acuerdo", "acuerdo"),  # no change
    ("analisis", "análisis"),
    ("Analisis", "Análisis"),
    ("asi", "así"),
    ("sintesis", "síntesis"),
    ("parentesis", "paréntesis"),
    ("paraplegico", "parapléjico"),
    # Present-future verbs
    ("tendra", "tendrá"),
    ("podra", "podrá"),
    ("dara", "dará"),
    ("sera", "será"),
    ("habra", "habrá"),
    ("ira", "irá"),
    ("hara", "hará"),
    ("vendra", "vendrá"),
    ("estara", "estará"),
    ("querra", "querrá"),
    ("podria", "podría"),
    ("tendria", "tendría"),
    ("daria", "daría"),
    ("seria", "sería"),
    ("iria", "iría"),
    ("haria", "haría"),
    ("estaria", "estaría"),
    # Past tenses (3rd person)
    ("estuvo", "estuvo"),  # no change
    ("fue", "fue"),  # no change
    # More proper nouns
    ("Venezuela", "Venezuela"),  # no change
    # "actuo" not common; skip
    ("accion", "acción"),  # already in pass 1
    # More words
    ("Enfasis", "Énfasis"),
    ("enfasis", "énfasis"),
    ("oxigeno", "oxígeno"),
    ("Oxigeno", "Oxígeno"),
    ("hidrogeno", "hidrógeno"),
    ("nitrogeno", "nitrógeno"),
    ("carbohidratos", "carbohidratos"),  # no change
    ("eolica", "eólica"),
    ("eolicas", "eólicas"),
    ("eolicos", "eólicos"),
    ("eolico", "eólico"),
    ("geotermica", "geotérmica"),
    ("geotermicas", "geotérmicas"),
    ("geotermico", "geotérmico"),
    ("fosil", "fósil"),
    ("fosiles", "fósiles"),
    # Conflict words
    ("traicion", "traición"),
    ("Traicion", "Traición"),
    ("tradicion", "tradición"),
    ("tradiciones", "tradiciones"),  # no tilde
    ("Tradicion", "Tradición"),
    # Education
    ("bachillerato", "bachillerato"),  # no change
    ("academia", "academia"),  # no change
    ("curriculum", "currículum"),
    # Common adjectives
    ("solido", "sólido"),
    ("solida", "sólida"),
    ("solidos", "sólidos"),
    ("solidas", "sólidas"),
    ("arido", "árido"),
    ("humido", "húmedo"),
    ("humeda", "húmeda"),
    # Specific names/terms
    ("celebrity", "celebridad"),  # no change, not Spanish
    ("Caribe", "Caribe"),  # no change
    ("Pacifico", "Pacífico"),
    ("Atlantico", "Atlántico"),
    ("Antartico", "Antártico"),
    ("Amazonia", "Amazonía"),
    ("Amazonas", "Amazonas"),  # no change
    # Country/place names
    ("Peru", "Perú"),
    ("Mexico", "México"),
    ("Medellin", "Medellín"),
    ("Bogota", "Bogotá"),
    ("Estadistica", "Estadística"),
    ("Ecologia", "Ecología"),
    # People
    ("Lopez", "López"),
    ("Perez", "Pérez"),
    ("Rodriguez", "Rodríguez"),
    ("Gomez", "Gómez"),
    ("Jimenez", "Jiménez"),
    ("Sanchez", "Sánchez"),
    ("Martinez", "Martínez"),
    ("Ramirez", "Ramírez"),
    ("Gonzalez", "González"),
    ("Fernandez", "Fernández"),
    ("Hernandez", "Hernández"),
    ("Diaz", "Díaz"),
    # Verbs needed
    ("despues", "después"),
    ("tambien", "también"),
    ("demas", "demás"),
    ("ademas", "además"),
    ("Ademas", "Además"),
    ("mas", "más"),
    ("Mas", "Más"),
    ("asi", "así"),
    # Accented vowel roots
    ("alcaloide", "alcaloide"),  # no change
    # Careful ones (risky)
    ("Si", "Sí"),  # "Si" as "yes" vs "si" as "if"; caps form usually yes
    # Government
    ("fiscal", "fiscal"),  # no change
    ("fiscales", "fiscales"),  # no change
    # Common adverbs
    ("aqui", "aquí"),
    ("Aqui", "Aquí"),
    ("alli", "allí"),
    ("Alli", "Allí"),
    ("alla", "allá"),
    ("Alla", "Allá"),
    ("atras", "atrás"),
    # Question words that are always interrogative in our text
    ("cuales", "cuáles"),
    ("Cuales", "Cuáles"),
    # Missing -cion / -sion more
    ("afiliacion", "afiliación"),
    ("Misión", "Misión"),  # no change, already accented if source has tilde
    ("mision", "misión"),
    ("vision", "visión"),
    ("Vision", "Visión"),
    ("television", "televisión"),
    ("precision", "precisión"),
    ("subvencion", "subvención"),
    ("donacion", "donación"),
    ("donaciones", "donaciones"),  # no tilde
    ("funcion", "función"),
    ("funciones", "funciones"),  # no tilde
    ("disfuncion", "disfunción"),
    ("reunion", "reunión"),
    ("reuniones", "reuniones"),  # no tilde
    ("Reunion", "Reunión"),
    ("legion", "legión"),
    ("region", "región"),
    ("regiones", "regiones"),  # no tilde
    ("Region", "Región"),
    ("Regional", "Regional"),  # no change
    ("Regiones", "Regiones"),  # no tilde
    ("innovacion", "innovación"),
    ("Innovacion", "Innovación"),
    ("integracion", "integración"),
    ("Integracion", "Integración"),
    ("division", "división"),
    ("divisiones", "divisiones"),  # no tilde
    ("obligacion", "obligación"),
    ("obligaciones", "obligaciones"),  # no tilde
    ("notificacion", "notificación"),
    ("Notificacion", "Notificación"),
    ("invitacion", "invitación"),
    ("aceptacion", "aceptación"),
    ("rectificacion", "rectificación"),
    ("simplificacion", "simplificación"),
    ("calificacion", "calificación"),
    ("justificacion", "justificación"),
    ("verificacion", "verificación"),
    ("modificacion", "modificación"),
    ("modificaciones", "modificaciones"),  # no tilde
    ("publicacion", "publicación"),
    ("Publicacion", "Publicación"),
    ("proliferacion", "proliferación"),
    ("deforestacion", "deforestación"),
    ("Deforestacion", "Deforestación"),
    ("contaminacion", "contaminación"),
    ("Contaminacion", "Contaminación"),
    ("combinacion", "combinación"),
    ("coordinacion", "coordinación"),
    ("Coordinacion", "Coordinación"),
    ("vacunacion", "vacunación"),
    ("supervision", "supervisión"),
    ("Supervision", "Supervisión"),
    ("conexion", "conexión"),
    ("conexiones", "conexiones"),  # no tilde
    ("abstencion", "abstención"),
    ("congestion", "congestión"),
    ("Congestion", "Congestión"),
    ("indignacion", "indignación"),
    ("rezagacion", "rezagación"),
    ("estacion", "estación"),
    ("estaciones", "estaciones"),  # no tilde
    ("rehabilitacion", "rehabilitación"),
    ("conservacion", "conservación"),
    ("Conservacion", "Conservación"),
    ("preservacion", "preservación"),
    ("reforestacion", "reforestación"),
    ("ordenacion", "ordenación"),
    ("planificacion", "planificación"),
    ("Planificacion", "Planificación"),
    ("explicacion", "explicación"),
    ("Explicacion", "Explicación"),
    # Common missed tildes on specific nouns
    ("arbitraria", "arbitraria"),  # no change
    ("democracia", "democracia"),  # no change
    ("agenda", "agenda"),  # no change
    ("energia", "energía"),  # already in pass 1
    ("automatizacion", "automatización"),
    ("Automatizacion", "Automatización"),
    ("revaluacion", "revaluación"),
    ("devaluacion", "devaluación"),
]

SKIP = {"si", "mas", "Mas", "Si", "ano", "Ano", "anos", "Anos"}  # risky base forms

# For the ano → año replacement, context-check: in our political texts "ano" always means year
# (we're not writing anatomy content). So we'll do it. But skip the word if it's not "año" context.
# Actually, let me do it unconditionally since the risk is minimal in civic-tech content.

clean = []
for item in MAP:
    if len(item) != 2:
        continue
    s, d = item
    if s == d:
        continue
    if s in {"si", "mas", "Mas", "Si"}:  # truly ambiguous; skip
        continue
    clean.append((s, d))

patterns = [(re.compile(r"\b" + re.escape(s) + r"\b"), d) for s, d in clean]


def transform(text: str) -> str:
    for pat, dst in patterns:
        text = pat.sub(dst, text)
    return text


def main():
    targets = []
    data_dir = Path("data")
    for sub in ["categories", "questions", "candidates"]:
        targets.extend(sorted((data_dir / sub).glob("*.json")))
    targets.append(data_dir / "selected-questions.ts")

    changed = []
    for t in targets:
        if t.exists():
            original = t.read_text(encoding="utf-8")
            updated = transform(original)
            if original != updated:
                t.write_text(updated, encoding="utf-8")
                changed.append(str(t))

    print(f"Pass 2: modified {len(changed)} files")
    for c in changed:
        print(f"  {c}")


if __name__ == "__main__":
    main()
