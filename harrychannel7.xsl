<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:param name="paramKeyword" />
<xsl:param name="paramChannelID" />
<xsl:variable name="count" select="0" />

<xsl:template match="/">
  <html>
  	<head>
  		<title>Links</title>      
    </head>
	  <body>

      <h2>My Links</h2>
      <div style="color:#6666; font-family: verdana; font-style: italic; font-size: 10px; top: 20px;position: absolute; left: 80px; top: 45px;">
        <a href="#" onclick="HandleClose();"></a>
      </div>

      <xsl:for-each select="DocumentElement/Channel[IsActive='true']">
        <xsl:variable name="outerChannelID" select="ChannelID"/>
        <table class="pageme">
          <tr>
            <td>
              <a onclick="Search('{ChannelID}');return false;" href="#">
                <xsl:attribute name="tabindex">
                  <xsl:value-of select="position()+1000"/>
                </xsl:attribute>
                <xsl:attribute name="title">
                  <xsl:text>Click to view </xsl:text><xsl:value-of select="Name"/>
                </xsl:attribute>
                <xsl:value-of select="Name" />
              </a>
                
            </td>
              <td style="width: 18px; text-align: right;color:#DDD; font-family: verdana; font-style: italic; font-size: 10px;">
                <xsl:value-of select="count(..//Item[ChannelID=$outerChannelID])"/>
            </td>
          </tr>
        </table>
      </xsl:for-each>
      
      <div style="display: block; position: absolute; left: 120px; top: 20px;">
        <input id="searchID" type="text" size="8" maxlength="50" class="inputBoxClass" onkeydown="handleKeydown(event);" tabindex="1" style="margin: 0 2px 0 0;" />
        <input type="button" onclick="Search(''); return false;" value="Search" id="searchButtonID" />
          <br/>
          <span style="color:#6666; font-family: verdana; font-style: italic; font-size: 10px;">
            <xsl:value-of select="count(DocumentElement/Channel[IsActive='true'])" /> channels <xsl:value-of select="count(DocumentElement/Item)" /> links
          </span>
      </div>
      <div style="position: absolute; left: 134px; top: 50px;">
          <input type="hidden" id="innerDivHidden" />
          <h3 style="display:none; position: relative; left:40px; top: 10px;" class="channelNameHeader">
            <xsl:value-of select="/DocumentElement/Channel[ChannelID=$paramChannelID]/Name" />
          </h3>

          <xsl:choose>
            <xsl:when test="$paramKeyword=''">
              <xsl:call-template name="allLinks" />
            </xsl:when>
            <xsl:otherwise>
              <xsl:call-template name="searchLinks" />
            </xsl:otherwise>
          </xsl:choose>
                              
        </div>

    </body>
  </html>
</xsl:template>

  <xsl:template name="allLinks">
    <div id="{$paramChannelID}" style="display:none; position: absolute; top: 50px;" name="channelBlock">
      <ul class="paging">
        <xsl:for-each select="/DocumentElement/Item[ChannelID=$paramChannelID]">
          <li>
            <a href="{LinkText}" target="_blank">
              <xsl:attribute name="tabindex">
                <xsl:value-of select="position()+10"/>
              </xsl:attribute>
              <xsl:value-of select="Description" />
            </a>
          </li>
        </xsl:for-each>
      </ul>
    </div>
  </xsl:template>

  <xsl:template name="searchLinks">
    <div id="{$paramChannelID}" style="display:none; position: absolute; top: 50px;" name="channelBlock">
      <span style="position:absolute; left:50px; color:#6666; font-family: verdana; font-style: italic; font-size: 10px;"><xsl:value-of select="count(/DocumentElement/Item[contains(translate(Description,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),$paramKeyword)])"/> found</span>
      <br/>
      <ul class="paging">
        <xsl:for-each select="/DocumentElement/Item[contains(translate(Description,'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),$paramKeyword)]">
          <li>
            <a href="{LinkText}" target="_blank">
              <xsl:attribute name="tabindex">
                <xsl:value-of select="position()+10"/>
              </xsl:attribute>
              <xsl:value-of select="Description" />
            </a>
          </li>
        </xsl:for-each>
      </ul>
    </div>
  </xsl:template>

</xsl:stylesheet>
