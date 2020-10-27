<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:include href="data-contents.xsl"/>
  <xsl:include href="../bibliography.xsl"/>
  <xsl:include href="../revisions.xsl"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <div class="columns is-multiline">
          
          <div class="column is-two-thirds">
            <div class="content">
              <xsl:apply-templates select="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msContents"/>
            </div>
          </div>

          <div class="column is-one-third">
          </div>

          <div class="column is-full">
            <div class="content">
              <h3 class="title is-4">Bibliography</h3>
              <xsl:apply-templates select="tei:text/tei:body/tei:div[@type='bibliography']|tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:additional/tei:adminInfo/tei:recordHist/tei:source"/>
            </div>
          </div>

          <div class="column is-full">
            <div class="content">
              <xsl:apply-templates select="tei:teiHeader/tei:revisionDesc"/>
            </div>
          </div>

        </div>

        <div id="recordMeta" class="is-hidden">
          <xsl:if test="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msIdentifier/tei:idno/@facs">
            <xsl:attribute name="data-iiif"></xsl:attribute>
          </xsl:if>

          <xsl:if test="tei:facsimile/tei:graphic/@url">
            <xsl:attribute name="data-images">
              <xsl:value-of select="tei:facsimile/tei:graphic/@url"/>
            </xsl:attribute>
          </xsl:if>
        </div>

      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>