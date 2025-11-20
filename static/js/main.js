// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sports site initialized');
    
    initMobileNav();
    initMatchesSystem();
    initShareButtons();
});

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }
}

function initMatchesSystem() {
    const postsDataElement = document.getElementById('postsData');
    if (!postsDataElement) {
        console.error('Posts data not found');
        return;
    }

    let allPosts = [];
    try {
        const data = JSON.parse(postsDataElement.textContent);
        allPosts = data.allPosts || [];
    } catch (e) {
        console.error('Error parsing posts data:', e);
        return;
    }

    let state = {
        currentFilter: 'all',
        currentPage: 1,
        postsPerPage: 6,
        isLoading: false,
        allPosts: allPosts
    };

    const elements = {
        matchesContainer: document.getElementById('matchesContainer'),
        loadMoreBtn: document.getElementById('loadMore'),
        loadingSpinner: document.getElementById('loadingSpinner'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        liveMatchesContainer: document.getElementById('liveMatches')
    };

    initEventListeners();
    renderInitialMatches();
    updateLiveMatches();

    function initEventListeners() {
        elements.filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                handleFilterChange(filter);
            });
        });

        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.addEventListener('click', handleLoadMore);
        }
    }

    function handleFilterChange(filter) {
        elements.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });

        state.currentFilter = filter;
        state.currentPage = 1;

        if (elements.matchesContainer) {
            elements.matchesContainer.innerHTML = '';
        }
        
        renderMatches();
        updateLoadMoreButton();
    }

    function handleLoadMore() {
        if (state.isLoading) return;
        
        state.isLoading = true;
        showLoadingState();
        
        setTimeout(() => {
            state.currentPage++;
            renderMatches();
            updateLoadMoreButton();
            hideLoadingState();
            state.isLoading = false;
        }, 300);
    }

    function renderInitialMatches() {
        renderMatches();
        updateLoadMoreButton();
    }

    function renderMatches() {
        if (!elements.matchesContainer) return;

        const filteredPosts = getFilteredPosts();
        const startIndex = (state.currentPage - 1) * state.postsPerPage;
        const endIndex = startIndex + state.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        if (state.currentPage === 1 && postsToShow.length === 0) {
            showNoMatchesMessage();
            return;
        }

        const noMatchesMsg = elements.matchesContainer.querySelector('.no-matches');
        if (noMatchesMsg) noMatchesMsg.remove();

        postsToShow.forEach((post, index) => {
            const card = createMatchCard(post);
            card.style.animationDelay = `${index * 0.1}s`;
            elements.matchesContainer.appendChild(card);
        });
    }

    function getFilteredPosts() {
        if (state.currentFilter === 'all') {
            return state.allPosts;
        }
        return state.allPosts.filter(post => post.status === state.currentFilter);
    }

    // ✅ Author name date ke baad show hota hai
    function createMatchCard(post) {
        const article = document.createElement('article');
        article.className = `match-card ${post.status} new-card`;
        article.setAttribute('data-status', post.status);
        
        const matchDate = new Date(post.match_date + 'T' + post.match_time);
        const formattedDate = matchDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });

        const authorName = post.author ? escapeHtml(post.author) : 'Unknown';

        article.innerHTML = `
            <div class="match-card__header">
                <span class="league">${escapeHtml(post.league)}</span>
                <span class="status-badge ${post.status}">${post.status}</span>
            </div>
            
            <div class="match-card__teams">
                <div class="team">
                    <h3>${escapeHtml(post.team_home)}</h3>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <h3>${escapeHtml(post.team_away)}</h3>
                </div>
            </div>
            
            <div class="match-card__meta">
                <time datetime="${post.match_date}T${post.match_time}">
                    ${formattedDate} at ${post.match_time}
                </time>
                <span class="author"> — by ${authorName}</span>
            </div>
            
            <div class="match-card__actions">
                <a href="${post.permalink}" class="btn" aria-label="View ${escapeHtml(post.title)} details">
                    View Details
                </a>
            </div>
        `;
        
        return article;
    }

    function showNoMatchesMessage() {
        if (!elements.matchesContainer) return;
        
        elements.matchesContainer.innerHTML = `
            <div class="no-matches">
                <p>No ${state.currentFilter === 'all' ? '' : state.currentFilter} matches found.</p>
            </div>
        `;
    }

    function updateLoadMoreButton() {
        if (!elements.loadMoreBtn) return;
        
        const filteredPosts = getFilteredPosts();
        const totalPosts = filteredPosts.length;
        const loadedPosts = state.currentPage * state.postsPerPage;

        if (loadedPosts < totalPosts) {
            elements.loadMoreBtn.style.display = 'block';
            elements.loadMoreBtn.disabled = false;
            elements.loadMoreBtn.textContent = 'Load More Matches';
        } else {
            elements.loadMoreBtn.style.display = 'none';
        }
    }

    function showLoadingState() {
        if (elements.loadingSpinner) {
            elements.loadingSpinner.style.display = 'block';
        }
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.disabled = true;
            elements.loadMoreBtn.innerHTML = 'Loading...';
        }
    }

    function hideLoadingState() {
        if (elements.loadingSpinner) {
            elements.loadingSpinner.style.display = 'none';
        }
        if (elements.loadMoreBtn) {
            elements.loadMoreBtn.disabled = false;
            elements.loadMoreBtn.innerHTML = 'Load More Matches';
        }
    }

    function updateLiveMatches() {
        if (!elements.liveMatchesContainer) return;
        
        const livePosts = state.allPosts.filter(post => post.status === 'live');
        
        if (livePosts.length === 0) {
            elements.liveMatchesContainer.innerHTML = `
                <div class="no-live-matches">
                    <p>No live matches at the moment. Check back later!</p>
                </div>
            `;
        } else {
            elements.liveMatchesContainer.innerHTML = `
                <div class="live-matches-count">
                    <p>Currently <strong>${livePosts.length}</strong> match${livePosts.length > 1 ? 'es' : ''} live</p>
                    <div class="live-matches-list">
                        ${livePosts.map(post => `
                            <div class="live-match-item">
                                <strong>${escapeHtml(post.team_home)} vs ${escapeHtml(post.team_away)}</strong>
                                <span class="live-badge">LIVE</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-share');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            let shareUrl;
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
}
// button code //

    document.getElementById('watchNowBtn').addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // Redirect logic (replace with your live URL)
      setTimeout(() => {
        alert("Redirecting to live stream...");
        // window.location.href = "your-live-stream-url-here";
      }, 300);
    });
  