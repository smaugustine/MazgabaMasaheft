<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:include href="../revisions.xsl"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <div class="content">
          
          <xsl:apply-templates select="tei:teiHeader/tei:fileDesc/tei:titleStmt"/>

          <xsl:apply-templates select="tei:teiHeader/tei:revisionDesc"/>

        </div>

      </body>
    </html>
  </xsl:template>


  <xsl:template match="tei:titleStmt">
    <h3 class="title is-4">Titles</h3>
    <ul>
      <xsl:apply-templates select="tei:title"/>
    </ul>
  </xsl:template>

  <xsl:template match="tei:title[@xml:lang='gez']">
    <xsl:variable name="anchor" select="concat('#', ./@xml:id)"/>

    <li>
      <xsl:value-of select="."/>

      <xsl:text> (</xsl:text>
      <i><xsl:value-of select="../tei:title[@corresp=$anchor and @xml:lang='gez']"/></i>

      <xsl:if test="../tei:title[@corresp=$anchor and @xml:lang='en']">
        <xsl:text>, </xsl:text>
        <xsl:value-of select="../tei:title[@corresp=$anchor and @xml:lang='en']"/>
      </xsl:if>

      <xsl:text>)</xsl:text>
    </li>
  </xsl:template>

  <xsl:template match="tei:title[@corresp]" />

</xsl:stylesheet>