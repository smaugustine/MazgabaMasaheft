<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" indent="no"/>

  <xsl:template match="tei:TEI">
    <html>
      <body>

        <h3 class="title is-3"><xsl:value-of select="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msIdentifier/tei:idno"/></h3>
        <h4 class="subtitle is-5"><xsl:value-of select="tei:teiHeader/tei:fileDesc/tei:titleStmt/tei:title"/></h4>

        <div class="tabs is-boxed is-small">
          <ul>
            <li class="is-active">
              <a>
                <xsl:attribute name="data-ms">
                  <xsl:value-of select="@xml:id"/>
                </xsl:attribute>
                <xsl:attribute name="data-tab">
                  <xsl:text>description</xsl:text>
                </xsl:attribute>
                <xsl:text>Description</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="data-ms">
                  <xsl:value-of select="@xml:id"/>
                </xsl:attribute>
                <xsl:attribute name="data-tab">
                  <xsl:text>transcription</xsl:text>
                </xsl:attribute>
                <xsl:text>Transcription</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="data-ms">
                  <xsl:value-of select="@xml:id"/>
                </xsl:attribute>
                <xsl:attribute name="data-tab">
                  <xsl:text>translation</xsl:text>
                </xsl:attribute>
                <xsl:text>Translation</xsl:text>
              </a>
            </li>
            <li>
              <a>
                <xsl:attribute name="href">
                  <xsl:text>/xml/</xsl:text>
                  <xsl:value-of select="@xml:id"/>
                  <xsl:text>.xml</xsl:text>
                </xsl:attribute>
                <xsl:text>XML</xsl:text>
              </a>
            </li>
          </ul>
        </div>

        <div class="content">
          <xsl:attribute name="id">
            <xsl:value-of select="@xml:id"/>
            <xsl:text>-description</xsl:text>
          </xsl:attribute>

          <xsl:apply-templates select="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:physDesc/tei:objectDesc"/>

          <xsl:apply-templates select="tei:teiHeader/tei:fileDesc/tei:sourceDesc/tei:msDesc/tei:msContents"/>
        </div>

        <div class="is-hidden">
          <xsl:attribute name="id">
            <xsl:value-of select="@xml:id"/>
            <xsl:text>-transcription</xsl:text>
          </xsl:attribute>

          <xsl:apply-templates select="tei:text/tei:body/tei:div[@type='edition']"/>

          <nav class="pagination is-small">
            <ul class="pagination-list">
              <xsl:for-each select="tei:text/tei:body/tei:div[@type='edition']/tei:div[@type='textpart' ]">
              <li>
                <a class="pagination-link">
                  <xsl:attribute name="data-item">
                    <xsl:value-of select="/tei:TEI/@xml:id"/>
                    <xsl:value-of select="@corresp"/>
                  </xsl:attribute>
                  <xsl:value-of select="position()"/>
                </a>
              </li>
              </xsl:for-each>
            </ul>
          </nav>
        </div>

        <div class="is-hidden">
          <xsl:attribute name="id">
            <xsl:value-of select="@xml:id"/>
            <xsl:text>-translation</xsl:text>
          </xsl:attribute>

          <xsl:apply-templates select="tei:text/tei:body/tei:div[@type='translation' ]"/>
        </div>

      </body>
    </html>
  </xsl:template>

  <xsl:template match="tei:msContents">
    <p>
      <xsl:apply-templates select="tei:summary"/>
    </p>

    <ol>
      <xsl:apply-templates select="tei:msItem"/>
    </ol>
  </xsl:template>

  <xsl:template match="tei:msItem">
    <li>
      <strong><i><xsl:value-of select="tei:title"/></i></strong>
      <span> (ff. <xsl:value-of select="tei:locus/@from"/> - <xsl:value-of select="tei:locus/@to"/>)</span>
      <xsl:if test="tei:msItem">
      <span>
        <a>
          <xsl:attribute name="data-for">
            <xsl:value-of select="ancestor::tei:TEI/@xml:id"/>
            <xsl:value-of select="./@xml:id"/>
          </xsl:attribute>
          <xsl:text> [Expand]</xsl:text>
        </a>
      </span>
      </xsl:if>
      <xsl:apply-templates select="tei:incipit|tei:explicit"/>

      <ol style="display: none;">
        <xsl:attribute name="id">
          <xsl:value-of select="ancestor::tei:TEI/@xml:id"/>
          <xsl:value-of select="./@xml:id"/>
        </xsl:attribute>
        <xsl:apply-templates select="tei:msItem"/>
      </ol>
    </li>
  </xsl:template>

  <xsl:template match="tei:incipit">
    <p>
      <strong>Incipit: </strong>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="tei:explicit">
    <p>
      <strong>Explicit: </strong>
      <xsl:apply-templates/>
    </p>
  </xsl:template>

  <xsl:template match="tei:foreign">
    <i>
      <xsl:attribute name="lang"><xsl:value-of select="./@xml:lang" /></xsl:attribute>
      <xsl:value-of select="."/>
    </i>
  </xsl:template>

  <xsl:template match="tei:gap[@reason='ellipsis' ]">
    <xsl:text disable-output-escaping="yes"><![CDATA[&hellip;]]></xsl:text>
  </xsl:template>

  <xsl:template match="tei:supplied[@reason='omitted' ]">
    <xsl:text disable-output-escaping="yes"><![CDATA[&lsaquo;]]></xsl:text><xsl:value-of select="."/><xsl:text disable-output-escaping="yes"><![CDATA[&rsaquo;]]></xsl:text>
  </xsl:template>

  <xsl:template match="tei:supplied[@reason='lost' ]">
    <xsl:text disable-output-escaping="yes"><![CDATA[&#91;]]></xsl:text><xsl:value-of select="."/><xsl:text disable-output-escaping="yes"><![CDATA[&#93;]]></xsl:text>
  </xsl:template>

  <xsl:template match="tei:div[@type='textpart' ]">
    <div class="content textpart is-hidden">
      <xsl:attribute name="data-item">
        <xsl:value-of select="/tei:TEI/@xml:id"/>
        <xsl:value-of select="@corresp"/>
      </xsl:attribute>
    
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <xsl:template match="tei:pb">
    <abbr>
      <xsl:attribute name="title">fol. <xsl:value-of select="./@n"/></xsl:attribute>
      <xsl:text disable-output-escaping="yes"><![CDATA[&ast;]]></xsl:text>
    </abbr>
  </xsl:template>

  <xsl:template match="tei:p">
    <p><xsl:apply-templates/></p>
  </xsl:template>

  <xsl:template match="tei:hi[@rend='rubric' ]">
    <span class="has-text-danger"><xsl:apply-templates/></span>
  </xsl:template>

  <xsl:template match="tei:sic">
    <xsl:if test="../tei:corr=''">
      <xsl:text disable-output-escaping="yes"><![CDATA[&#123;]]></xsl:text>
      <xsl:apply-templates/>
      <xsl:text disable-output-escaping="yes"><![CDATA[&#125;]]></xsl:text>
    </xsl:if>
  </xsl:template>

  <xsl:template match="tei:objectDesc">
    <p>
      <span><xsl:value-of select="./@form"/>, </span>
      <span><xsl:value-of select="tei:supportDesc/tei:support/tei:material/@key"/>; </span>
      <span>ff. <xsl:value-of select="tei:supportDesc/tei:extent/tei:measure[@unit='leaf']"/>; </span>
      <span><xsl:value-of select="tei:layoutDesc/tei:layout/@columns"/> column(s), </span>
      <span><xsl:value-of select="tei:layoutDesc/tei:layout/@writtenLines"/> lines.</span>
    </p>
  </xsl:template>

</xsl:stylesheet>