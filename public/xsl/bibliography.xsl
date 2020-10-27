<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:template match="tei:div[@type='bibliography']">
    <xsl:if test="tei:listBibl[@type='editions']">
      <div class="block content">
        <h4 class="title is-5">Editions</h4>
        <xsl:apply-templates select="tei:listBibl[@type='editions']"/>
      </div>
    </xsl:if>

    <xsl:if test="tei:listBibl[@type='secondary']">
      <div class="block content">
        <h4 class="title is-5">Secondary</h4>
        <xsl:apply-templates select="tei:listBibl[@type='secondary']"/>
      </div>
    </xsl:if>
  </xsl:template>

  <xsl:template match="tei:source">
    <div class="block content">
      <h4 class="title is-5">Catalogues</h4>
      <xsl:apply-templates select="tei:listBibl[@type='catalogue']"/>
    </div>
  </xsl:template>

  <xsl:template match="tei:bibl">
    <div>
      <xsl:attribute name="data-zotero">
        <xsl:value-of select="tei:ptr/@target"/>
      </xsl:attribute>
    </div>
  </xsl:template>

</xsl:stylesheet>