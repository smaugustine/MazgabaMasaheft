<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:template match="tei:revisionDesc">
    <h3 class="title is-4">Revision History</h3>
    <ul>
      <xsl:apply-templates select="tei:change"/>
    </ul>
  </xsl:template>

  <xsl:template match="tei:change">
    <li>
      <strong><span>
        <xsl:attribute name="data-initials">
          <xsl:value-of select="./@who"/>
        </xsl:attribute>
        <xsl:value-of select="./@who"/>
      </span></strong>
      <xsl:text> </xsl:text>
      <xsl:value-of select="."/>
      <xsl:text> (</xsl:text>
      <time>
        <xsl:attribute name="datetime">
          <xsl:value-of select="./@when"/>
        </xsl:attribute>
      </time>
      <xsl:text>)</xsl:text>
    </li>
  </xsl:template>

</xsl:stylesheet>