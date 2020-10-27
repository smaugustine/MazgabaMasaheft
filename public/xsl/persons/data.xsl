<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:include href="../revisions.xsl"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <div class="columns is-multiline">

          <xsl:apply-templates select="tei:text/tei:body/tei:listPerson/tei:person"/>

          <div class="column is-full">
            <div class="content">
              <xsl:apply-templates select="tei:teiHeader/tei:revisionDesc"/>
            </div>
          </div>

        </div>

      </body>
    </html>
  </xsl:template>


  <xsl:template match="tei:person">
    <div class="column is-two-thirds">
      <div class="content">
        <h3 class="title is-4">Names</h3>
        <ul>
          <xsl:apply-templates select="tei:persName"/>
        </ul>
      </div>
    </div>

    <div class="column is-one-third">
      <div class="panel">
      <div class="panel-block">
          <p>
            <b>Gender: </b>
            <xsl:if test="./@sex='1'">Male</xsl:if>
            <xsl:if test="./@sex='2'">Female</xsl:if>
          </p>
        </div>
        <div class="panel-block">
          <p>
            <b>Birth: </b>
            <xsl:value-of select="tei:birth/@when"/>
          </p>
        </div>
        <div class="panel-block">
          <p>
            <b>Floruit: </b>
            <xsl:value-of select="tei:floruit/@notBefore"/>-<xsl:value-of select="tei:floruit/@notAfter"/>
          </p>
        </div>
        <div class="panel-block">
          <p>
            <b>Death: </b>
            <xsl:value-of select="tei:death/@when"/>
          </p>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="tei:persName[@xml:lang='gez']">
    <xsl:variable name="anchor" select="concat('#', ./@xml:id)"/>

    <li>
      <xsl:value-of select="."/>

      <xsl:text> (</xsl:text>
      <i><xsl:value-of select="../tei:persName[@corresp=$anchor and @xml:lang='gez']"/></i>

      <xsl:if test="../tei:persName[@corresp=$anchor and @xml:lang='en']">
        <xsl:text>, </xsl:text>
        <xsl:value-of select="../tei:persName[@corresp=$anchor and @xml:lang='en']"/>
      </xsl:if>

      <xsl:text>)</xsl:text>
    </li>
  </xsl:template>

  <xsl:template match="tei:persName[@corresp]" />

</xsl:stylesheet>