<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:include href="../bibliography.xsl"/>
  <xsl:include href="../revisions.xsl"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <div class="columns is-multiline">

          <xsl:apply-templates select="tei:text/tei:body/tei:listPlace/tei:place"/>

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

      </body>
    </html>
  </xsl:template>


  <xsl:template match="tei:place">
    <div class="column is-two-thirds">
      <div class="content">
        <h3 class="title is-4">Names</h3>
        <ul>
          <xsl:apply-templates select="tei:placeName"/>
        </ul>
      </div>
    </div>

    <div class="column is-one-third">
      <div class="panel">
        <div class="panel-block">
          
        </div>
      </div>

      <div class="message is-info">
        <div class="message-body content">
          <p>Search for manuscripts that reference this institution:</p>
          <div class="buttons is-centered">
            <a class="button is-info is-small">
              <xsl:attribute name="href">
                <xsl:text disable-output-escaping="yes">/search?type=manuscripts<![CDATA[&]]>q=</xsl:text>
                <xsl:value-of select="/*/@xml:id"/>
              </xsl:attribute>
              <span class="icon"><i class="fas fa-search"></i></span>
              <span>Search</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </xsl:template>

  <xsl:template match="tei:placeName">
    <li><xsl:value-of select="."/></li>
  </xsl:template>

</xsl:stylesheet>