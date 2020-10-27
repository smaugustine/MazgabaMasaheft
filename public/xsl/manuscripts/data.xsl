<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:include href="data-contents.xsl"/>
  <xsl:include href="../revisions.xsl"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <h3 class="title is-4">Contents</h3>

        <div class="content">
        
          <xsl:apply-templates select="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msContents"/>

        </div>

        <div class="content">
          <xsl:apply-templates select="tei:teiHeader/tei:revisionDesc"/>
        </div>

      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>