#!/usr/bin/env python3
"""
Update 'context' field of curated questions with balanced, factual explanations.

Principles:
- Neutral language (use "defensores"/"críticos" or "quienes apoyan"/"quienes se oponen")
- Include at least one factual data point where possible
- Brief (~2-3 sentences)
- Present both perspectives fairly
- Avoid loaded adjectives ("obviamente", "claramente", "ideal")
- Use Spanish with proper accents

Citations are approximate / orders of magnitude - the goal is to give users
ballpark context, not to be the definitive data source.
"""
import json
import os

NEW_CONTEXTS = {
    # Agricultura
    "agr-01": "El Coeficiente de Gini rural de tierra en Colombia supera 0.87, uno de los más altos del mundo (ONU, DANE). Quienes apoyan la redistribución argumentan que es necesaria para cerrar brechas históricas y dinamizar el campo. Quienes se oponen señalan riesgos para la seguridad jurídica y la productividad agrícola.",
    "agr-06": "Colombia tiene alrededor de 230.000 hectáreas sembradas con coca (UNODC 2023). La sustitución voluntaria ofrece alternativas productivas al campesino; sus defensores destacan su sostenibilidad. La erradicación forzada (manual o aérea) es defendida por quienes la ven más rápida frente a estructuras criminales y economías ilegales.",

    # Comercio Exterior
    "com-01": "Colombia tiene TLC vigentes con EE.UU., Unión Europea, Corea del Sur, México y otros. Defensores citan aumento de exportaciones e inversión extranjera directa. Críticos argumentan impacto negativo en sectores como agricultura (lácteos, arroz) y en pequeños productores que no pueden competir con importaciones subsidiadas.",

    # Cultura
    "cul-04": "En Colombia el matrimonio civil entre personas del mismo sexo y la adopción conjunta son permitidos por sentencias de la Corte Constitucional (2016 y 2015 respectivamente), no por ley del Congreso. Quienes apoyan incluirlo en la ley buscan mayor seguridad jurídica; quienes se oponen lo hacen por razones religiosas, de tradición o interpretación constitucional.",
    "cul-06": "El reconocimiento legal de identidades no binarias (documento de identidad con opción \"no binario\") es un debate emergente en varios países. Defensores argumentan protección frente a discriminación y reconocimiento de la realidad de personas trans y no binarias. Opositores plantean preocupaciones sobre implicaciones legales, registros oficiales o ámbitos como el deporte.",

    # Economía
    "econ-01": "Colombia tiene alta desigualdad de ingresos (Gini ≈ 0,55, uno de los más altos de América Latina). Defensores de impuestos progresivos argumentan que mejoran redistribución y financian programas sociales. Críticos señalan riesgo de fuga de capitales, reducción de inversión y baja recaudación si las bases tributarias son estrechas.",
    "econ-02": "El gasto público colombiano ronda el 30% del PIB. Quienes proponen reducirlo citan eficiencia, menos burocracia y más espacio para el sector privado. Quienes se oponen argumentan que el Estado cumple funciones esenciales de redistribución, regulación y provisión de bienes públicos que el mercado por sí solo no garantiza.",
    "econ-05": "Los subsidios a combustibles y controles de precios a alimentos cuestan al Estado billones de pesos al año. Defensores de la intervención citan protección a hogares vulnerables frente a shocks de precios. Críticos señalan distorsiones de mercado, contrabando y que los subsidios generalizados benefician más a sectores altos que a los pobres.",

    # Educación
    "edu-01": "La cobertura de educación superior en Colombia es cercana al 54%, con marcada brecha rural-urbana. Defensores de la gratuidad argumentan que es un derecho y reduce barreras económicas. Críticos señalan el costo fiscal, el riesgo de subsidiar a quienes pueden pagar, y plantean priorizar la calidad de educación básica y media.",

    # Energía
    "ene-01": "El sector petrolero genera aproximadamente 40% de las exportaciones y 15-20% de los ingresos fiscales. Quienes apoyan detener nueva exploración priorizan la transición energética y las metas climáticas. Quienes se oponen citan dependencia fiscal, empleo en regiones productoras y la necesidad de una transición gradual.",
    "ene-04": "El fracking (fractura hidráulica) permite extraer gas de yacimientos no convencionales. Defensores lo presentan como vía a la autosuficiencia energética y empleo. Opositores citan riesgos ambientales (uso intensivo de agua, sismicidad inducida, contaminación de acuíferos) y contradicción con los compromisos climáticos del país.",
    "ene-05": "Colombia tiene dos mecanismos: consulta previa para pueblos étnicos (vinculante) y consulta popular para municipios (alcance limitado por la Corte Constitucional). Defensores del veto comunitario citan autonomía territorial y protección ambiental. Opositores citan el interés general, la seguridad jurídica para la inversión y los ingresos que financian regiones.",

    # Justicia
    "jus-03": "La Jurisdicción Especial para la Paz (JEP) investiga crímenes del conflicto armado desde 2017, bajo el Acuerdo de Paz con las FARC. Defensores destacan su papel en verdad, reparación y justicia restaurativa. Críticos cuestionan sanciones alternativas (no cárcel) para responsables de crímenes graves, la duración prolongada y el alcance temporal limitado al conflicto FARC.",

    # Medio Ambiente
    "amb-01": "Colombia implementó un impuesto al carbono en 2016 (alrededor de USD 5 por tonelada de CO2), considerado bajo frente a estándares internacionales. Defensores de aumentarlo citan el cumplimiento de metas climáticas y la señal de precio al sector productivo. Críticos señalan impacto en costos energéticos, transporte y competitividad industrial si la transición no es gradual.",
    "amb-04": "La minería, hidrocarburos y agroindustria generan empleo e ingresos regionales pero presionan ecosistemas. Quienes priorizan desarrollo citan reducción de pobreza y financiación pública. Quienes priorizan protección ambiental citan servicios ecosistémicos, agua, biodiversidad y derechos intergeneracionales.",

    # Política Exterior
    "ext-01": "Las relaciones diplomáticas Colombia-Venezuela se rompieron en 2019 y se restablecieron en 2022. Defensores de mantenerlas abiertas citan comercio fronterizo, migración (2,8M de venezolanos en Colombia) y manejo humanitario. Opositores citan la situación política de Venezuela, la presencia de grupos armados y la alineación con sanciones internacionales.",
    "ext-03": "EE.UU. ha sido el principal aliado de Colombia en seguridad (Plan Colombia desde 2000) y el mayor socio comercial. Quienes apoyan mayor alineación citan cooperación antidrogas, ayuda militar y acceso al mercado estadounidense. Quienes prefieren mayor autonomía citan soberanía, diversificación estratégica hacia China/UE y una política exterior multipolar.",

    # Salud
    "sal-01": "Las EPS (Entidades Promotoras de Salud) intermedian el sistema desde la Ley 100 de 1993. Quienes proponen eliminarlas citan barreras de acceso, tutelas masivas y quiebras de varias EPS. Quienes las defienden citan la gestión del riesgo en salud, la libertad de elección y advierten sobre los costos de una transición abrupta a sistema único estatal.",
    "sal-05": "Colombia tiene un sistema mixto: aseguramiento público-privado regulado por el Estado, y medicina prepagada complementaria. Defensores del rol privado citan calidad, eficiencia y libertad de elección. Críticos señalan inequidad entre regímenes, captura de recursos públicos y priorización de rentabilidad sobre salud.",

    # Seguridad
    "seg-01": "La 'paz total' del gobierno actual busca diálogos simultáneos con guerrillas (ELN, disidencias FARC) y estructuras criminales (Clan del Golfo, bandas urbanas). Defensores la ven como estrategia integral para cerrar ciclos de violencia. Críticos cuestionan la extensión de beneficios penales a grupos sin ideología política, resultados limitados y riesgos de revictimización.",
    "seg-03": "Colombia sigue siendo el mayor productor mundial de cocaína, con décadas de guerra contra las drogas a costo humano y económico alto. Quienes apoyan legalización o regulación citan el fracaso del enfoque prohibicionista y los modelos de Portugal y Uruguay. Quienes se oponen citan riesgos de salud pública, obstáculos diplomáticos (ONU) y reticencia de EE.UU.",
    "seg-07": "Colombia comparte ~2.200 km de frontera con Venezuela y alberga 2,8M de migrantes venezolanos. Quienes apoyan una posición firme citan migración irregular, contrabando, presencia del ELN en zona fronteriza y derechos humanos. Quienes prefieren distensión citan economía fronteriza, cooperación humanitaria y el riesgo de aislar a Colombia regionalmente.",

    # Tecnología
    "tec-03": "Colombia invierte aproximadamente 0,3% del PIB en ciencia, tecnología e innovación; el promedio de la OCDE es cercano al 2,5%. Defensores de aumentar la inversión citan competitividad a largo plazo, diversificación económica y generación de empleo calificado. Críticos priorizan otras necesidades fiscales (salud, educación básica, infraestructura) o cuestionan la ejecución eficiente de recursos.",

    # Trabajo
    "tra-02": "Colombia tiene aproximadamente 55% de informalidad laboral (DANE). Defensores de flexibilizar la contratación argumentan que reduce costos de formalización y aumenta empleo formal. Críticos señalan que flexibilización histórica ha precarizado el empleo sin reducir sustancialmente la informalidad, y que afecta derechos como estabilidad, horas extras y seguridad social.",
    "tra-05": "Programas como Familias en Acción benefician a ~2,7M de hogares con transferencias condicionadas. Defensores de una renta básica universal citan simplicidad administrativa, dignidad y reducción de trámites. Críticos citan el costo fiscal (varios puntos del PIB) y posibles efectos negativos sobre incentivos laborales.",
    "tra-06": "El sistema actual tiene Colpensiones (público, reparto solidario) y AFPs (privadas, ahorro individual). Defensores del sistema público de reparto citan solidaridad intergeneracional y cobertura a trabajadores de bajos ingresos. Defensores del sistema privado citan sostenibilidad fiscal de largo plazo y rentabilidad individual del ahorro.",

    # Vivienda
    "viv-01": "El déficit habitacional en Colombia supera 3 millones de hogares (DANE), entre cuantitativo y cualitativo. Defensores de construcción pública directa citan acceso garantizado y control de calidad. Defensores de subsidios a la demanda (Mi Casa Ya, FRECH) citan eficiencia, diversidad de oferta y dinamización del sector constructor privado.",
}


def main():
    questions_dir = "data/questions"
    updated = 0
    not_found = []

    # Read all question files
    for fname in sorted(os.listdir(questions_dir)):
        if not fname.endswith(".json"):
            continue
        path = os.path.join(questions_dir, fname)
        with open(path, encoding="utf-8") as f:
            questions = json.load(f)

        changed = False
        for q in questions:
            qid = q["id"]
            if qid in NEW_CONTEXTS:
                old = q.get("context", "")
                new = NEW_CONTEXTS[qid]
                if old != new:
                    q["context"] = new
                    changed = True
                    updated += 1

        if changed:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(questions, f, ensure_ascii=False, indent=2)
                f.write("\n")

    # Warn about any missing
    all_target_ids = set(NEW_CONTEXTS.keys())
    all_question_ids = set()
    for fname in os.listdir(questions_dir):
        if fname.endswith(".json"):
            with open(os.path.join(questions_dir, fname), encoding="utf-8") as f:
                for q in json.load(f):
                    all_question_ids.add(q["id"])
    missing = all_target_ids - all_question_ids
    if missing:
        print(f"WARN: these target IDs not found in questions: {sorted(missing)}")

    print(f"Updated {updated} contexts across {len(NEW_CONTEXTS)} targeted questions.")


if __name__ == "__main__":
    main()
